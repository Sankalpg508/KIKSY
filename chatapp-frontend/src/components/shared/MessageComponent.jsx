import { Box, Typography, alpha } from "@mui/material";
import React, { memo, useState } from "react";
import { palette } from "../../constants/color";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const [isHovered, setIsHovered] = useState(false);

  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();

  // Animation variants
  const messageVariants = {
    initial: { 
      opacity: 0, 
      x: sameSender ? 50 : -50,
      y: 20
    },
    animate: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        mass: 1
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  // Content animation variants
  const contentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { delay: 0.1, duration: 0.3 } 
    }
  };

  // Attachment animation variants
  const attachmentVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: (index) => ({ 
      opacity: 1, 
      scale: 1, 
      transition: { delay: 0.2 + (index * 0.1), duration: 0.3 }
    })
  };

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      variants={messageVariants}
      viewport={{ once: true, amount: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: sameSender ? alpha(palette.blue, 0.1) : alpha(palette.cream, 0.7),
        color: palette.navy,
        borderRadius: "12px",
        padding: "0.75rem 1rem",
        maxWidth: "80%",
        width: "fit-content",
        margin: "0.5rem 0",
        position: "relative",
        border: `1px solid ${alpha(sameSender ? palette.blue : palette.orange, 0.2)}`,
        borderTopLeftRadius: !sameSender ? "0" : "12px",
        borderTopRightRadius: sameSender ? "0" : "12px",
      }}
    >
      {/* Message tail */}
      <Box
          sx={{
            position: "absolute",
            top: 0,
            [sameSender ? "right" : "left"]: -10,
            width: 0,
            height: 0,
            borderTop: `10px solid ${sameSender ? alpha(palette.blue, 0.1) : alpha(palette.cream, 0.7)}`,
            borderRight: sameSender ? "none" : "10px solid transparent",
            borderLeft: sameSender ? "10px solid transparent" : "none",
            borderTopColor: sameSender ? alpha(palette.blue, 0.1) : alpha(palette.cream, 0.7),
          }}
        />

      {/* Sender name with special styling */}
      {!sameSender && (
        <Typography 
          fontWeight={"600"} 
          variant="caption"
          sx={{
            color: palette.blue,
            display: "block",
            marginBottom: "0.3rem",
            fontSize: "0.75rem",
            textShadow: `0 1px 1px ${alpha(palette.blue, 0.1)}`,
          }}
        >
          {sender.name}
        </Typography>
      )}

      {/* Message content with animation */}
      {content && (
        <motion.div variants={contentVariants}>
          <Typography
            sx={{
              color: palette.navy,
              lineHeight: 1.5,
              wordBreak: "break-word",
              fontSize: "0.95rem",
            }}
          >
            {content}
          </Typography>
        </motion.div>
      )}

      {/* Attachments with animations */}
      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);

          return (
            <motion.div
              key={index}
              variants={attachmentVariants}
              custom={index}
              style={{
                margin: "0.5rem 0",
                transition: "all 0.3s ease",
              }}
            >
              <Box 
                sx={{
                  backgroundColor: alpha(palette.navy, 0.05),
                  borderRadius: "8px",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  '&:hover': {
                    backgroundColor: alpha(palette.navy, 0.1),
                    transform: "translateY(-2px)",
                    boxShadow: `0 4px 12px ${alpha(palette.navy, 0.1)}`,
                  }
                }}
              >
                <a
                  href={url}
                  target="_blank"
                  download
                  style={{
                    color: palette.navy,
                    display: "block",
                    padding: "0.5rem",
                    textDecoration: "none",
                  }}
                >
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            </motion.div>
          );
        })}

      {/* Timestamp with fade-in effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0.6 }}
        transition={{ duration: 0.2 }}
      >
        <Typography 
          variant="caption" 
          sx={{
            color: alpha(palette.navy, 0.6),
            display: "block",
            textAlign: "right",
            fontSize: "0.7rem",
            marginTop: "0.3rem",
            fontStyle: "italic",
          }}
        >
          {timeAgo}
        </Typography>
      </motion.div>
    </motion.div>
  );
};

export default memo(MessageComponent);