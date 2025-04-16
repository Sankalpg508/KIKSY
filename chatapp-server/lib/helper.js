import { userSocketIDs } from "../app.js";

export const getOtherMember = (members, userId) =>
  members.find((member) => member._id.toString() !== userId.toString());

export const getSockets = (users = []) => {
  const sockets = users.map((user) => userSocketIDs.get(user.toString()));

  return sockets;
};

export const getBase64 = (file) => {
  try {
    // Check file size to prevent memory issues
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      throw new Error(`File too large: ${file.originalname}`);
    }
    
    // Ensure mimetype is defined
    const mimetype = file.mimetype || 'application/octet-stream';
    
    // Generate proper data URI
    return `data:${mimetype};base64,${file.buffer.toString('base64')}`;
  } catch (error) {
    console.error("Base64 conversion error:", error);
    throw new Error(`Failed to process file: ${error.message}`);
  }
};
