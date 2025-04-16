import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Typography } from "@mui/material";
import { palette, themeColors } from "../constants/color";
import { motion } from "framer-motion";

const Home = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const textVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { 
        delay: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        delay: 0.6,
        duration: 0.5,
        type: "spring",
        stiffness: 200
      }
    },
    hover: {
      scale: 1.1,
      rotate: [0, 5, -5, 5, 0],
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ 
        height: "100%", 
        backgroundColor: palette.navy, // Set the background color of the container
        padding: "16px",
        borderRadius: "8px",
        boxShadow: themeColors.shadows.medium
      }}
    >
      <Box 
        height={"100%"}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          background: themeColors.gradients.primary,
          borderRadius: "8px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          padding: "3rem"
        }}
      >
        <motion.div variants={textVariants}>
          <Typography 
            variant="h4" 
            textAlign={"center"}
            sx={{ 
              color: palette.cream,
              fontWeight: "bold",
              mb: 4
            }}
          >
            Welcome to Kiksy
          </Typography>
        </motion.div>
        
        <motion.div
          variants={iconVariants}
          whileHover="hover"
        >
          <Box
            component="div"
            sx={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: palette.cream,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 4,
              boxShadow: `0 0 0 8px rgba(255, 236, 209, 0.2), 0 0 0 16px rgba(255, 236, 209, 0.1)`,
            }}
          >
            <svg 
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" 
                fill={palette.orange}
              />
              <path 
                d="M7 9H17M7 13H13" 
                stroke={palette.navy}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Box>
        </motion.div>
        
        <motion.div variants={textVariants}>
          <Typography 
            variant="h5" 
            textAlign={"center"}
            sx={{ 
              color: palette.cream,
              fontWeight: "medium"
            }}
          >
            Select a friend to start chatting
          </Typography>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default AppLayout()(Home);