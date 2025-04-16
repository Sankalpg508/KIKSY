import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from 'fs';

// Create uploads/temp directory if it doesn't exist
const tempDir = path.join(process.cwd(), 'uploads', 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir); // Use the variable we just created
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuid()}-${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Optional: add file type validation if needed
    cb(null, true);
  }
});

const singleAvatar = multerUpload.single("avatar");
const attachmentsMulter = multerUpload.array("files", 5);

export { singleAvatar, attachmentsMulter };