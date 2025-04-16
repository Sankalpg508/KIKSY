import React, { memo, useState } from "react";
import { Link } from "../styles/StyledComponents";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";
import { motion } from "framer-motion";
import { palette } from "../../constants/color";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Define the background colors properly for animation
  const defaultBgColor = sameSender ? palette.navy : "rgba(0,0,0,0)"; // Use rgba instead of transparent
  const hoverBgColor = sameSender ? palette.navy : palette.cream;

  // Animation variants
  const containerVariants = {
    initial: { 
      opacity: 0, 
      y: -20,
      x: -10
    },
    animate: { 
      opacity: 1, 
      y: 0,
      x: 0,
      transition: { 
        duration: 0.3, 
        delay: 0.05 * index,
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      scale: 1.02,
      backgroundColor: hoverBgColor,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 }
    }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  const newMessageVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 200
      }
    }
  };

  return (
    <Link
      sx={{
        padding: "0",
        textDecoration: "none",
        display: "block",
        marginBottom: "0.5rem",
        borderRadius: "8px",
        overflow: "hidden"
      }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
        initial="initial"
        whileInView="animate"
        whileHover="hover"
        variants={containerVariants}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          backgroundColor: defaultBgColor, // Using our defined variable here
          color: sameSender ? palette.cream : palette.navy,
          position: "relative",
          padding: "1rem",
          borderRadius: "8px",
          transition: "all 0.2s ease-in-out",
          cursor: "pointer",
          border: `1px solid ${isHovered ? palette.orange : "rgba(0,0,0,0)"}`
        }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <AvatarCard avatar={avatar} />
        </motion.div>

        <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
          <Typography 
            variant="subtitle1"
            sx={{ 
              fontWeight: sameSender ? 600 : 400,
              color: sameSender ? palette.cream : palette.navy
            }}
          >
            {name}
            {groupChat && (
              <Typography 
                component="span" 
                variant="caption" 
                sx={{ 
                  marginLeft: "0.5rem",
                  backgroundColor: palette.blue,
                  color: palette.cream,
                  padding: "2px 6px",
                  borderRadius: "10px",
                  fontSize: "0.7rem"
                }}
              >
                Group
              </Typography>
            )}
          </Typography>
          
          {newMessageAlert && (
            <motion.div
              variants={newMessageVariants}
              initial="initial"
              animate="animate"
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: sameSender ? palette.orange : palette.maroon,
                  fontWeight: 600
                }}
              >
                {newMessageAlert.count} New {newMessageAlert.count === 1 ? "Message" : "Messages"}
              </Typography>
            </motion.div>
          )}
        </Stack>

        {isOnline && (
          <motion.div
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          >
            <Box
              sx={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: palette.blue,
                border: `2px solid ${sameSender ? palette.cream : palette.navy}`,
                position: "absolute",
                top: "50%",
                right: "1rem",
                transform: "translateY(-50%)",
                boxShadow: "0 0 0 2px rgba(21, 97, 109, 0.3)"
              }}
            />
          </motion.div>
        )}
        
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute",
            right: "1rem",
            color: sameSender ? palette.cream : palette.navy,
          }}
        >
          <Typography variant="body2">→</Typography>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);