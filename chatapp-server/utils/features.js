import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { getBase64, getSockets } from "../lib/helper.js";

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "CHATTU" })
    .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
    .catch((err) => {
      throw err;
    });
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  return res.status(code).cookie("chattu-token", token, cookieOptions).json({
    success: true,
    user,
    message,
  });
};

const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");
  const usersSocket = getSockets(users);
  io.to(usersSocket).emit(event, data);
};

const uploadFilesToCloudinary = async (files = []) => {
  console.log(`Attempting to upload ${files.length} files to Cloudinary`);
  
  // Verify Cloudinary configuration
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error("Cloudinary configuration missing");
    throw new Error("Cloudinary configuration is incomplete");
  }
  
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      try {
        console.log(`Processing file: ${file.originalname}, path: ${file.path}`);
        
        // With disk storage, we should always have a file path
        if (!file.path) {
          return reject(new Error("File path is missing"));
        }
        
        // Set upload options based on file type
        const uploadOptions = {
          resource_type: "auto",
          public_id: path.basename(file.path, path.extname(file.path)), // Use filename without extension
          folder: "chattu"
        };
        
        // Add timeout for larger files like videos
        if (file.mimetype && file.mimetype.startsWith('video/')) {
          uploadOptions.timeout = 180000; // 3 minutes for videos
        }
        
        // Upload the file using the path
        cloudinary.uploader.upload(
          file.path, 
          uploadOptions,
          (error, result) => {
            // Attempt to delete the temp file regardless of upload result
            try {
              if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
                console.log(`Deleted temporary file: ${file.path}`);
              }
            } catch (cleanupError) {
              console.error(`Failed to delete temp file: ${file.path}`, cleanupError);
              // Continue despite cleanup error
            }
            
            if (error) {
              console.error(`Cloudinary upload error:`, error);
              reject(error);
            } else {
              console.log(`Upload successful for ${file.originalname}`);
              resolve({
                public_id: result.public_id,
                url: result.secure_url,
                resource_type: result.resource_type
              });
            }
          }
        );
      } catch (err) {
        console.error(`Error processing file ${file.originalname}:`, err);
        
        // Clean up on error
        try {
          if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (cleanupError) {
          console.error(`Failed to delete temp file during error handling`, cleanupError);
        }
        
        reject(err);
      }
    });
  });

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (err) {
    console.error("Upload error:", err);
    throw new Error(`Error uploading to Cloudinary: ${err.message}`);
  }
};

const deletFilesFromCloudinary = async (public_ids) => {
  // Delete files from cloudinary
};

export {
  connectDB,
  sendToken,
  cookieOptions,
  emitEvent,
  deletFilesFromCloudinary,
  uploadFilesToCloudinary,
};
