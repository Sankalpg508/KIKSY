import React from "react";
import { Avatar, Stack, Typography } from "@mui/material";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
  Description as BioIcon, // Added Bio icon import
} from "@mui/icons-material";
import moment from "moment";
import { transformImage } from "../../lib/features";
import { motion } from "framer-motion";
import { bgGradient, grayColor, palette, purpleLight } from "../../constants/color"

const Profile = ({ user }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const avatarVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 12px rgba(255,255,255,0.5)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
        <motion.div
          variants={avatarVariants}
          whileHover="hover"
        >
          <Avatar
            src={transformImage(user?.avatar?.url)}
            sx={{
              width: 200,
              height: 200,
              objectFit: "contain",
              marginBottom: "1rem",
              border: `5px solid ${palette.orange}`,
              boxShadow: `0 5px 15px rgba(0,0,0,0.3)`,
            }}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <ProfileCard 
            heading={"Bio"} 
            text={user?.bio} 
            Icon={<BioIcon />} 
            bgColor={purpleLight}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <ProfileCard
            heading={"Username"}
            text={user?.username}
            Icon={<UserNameIcon />}
            bgColor={palette.creamDark}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <ProfileCard 
            heading={"Name"} 
            text={user?.name} 
            Icon={<FaceIcon />} 
            bgColor={palette.orange}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <ProfileCard
            heading={"Joined"}
            text={moment(user?.createdAt).fromNow()}
            Icon={<CalendarIcon />}
            bgColor={palette.maroon}
          />
        </motion.div>
      </Stack>
    </motion.div>
  );
};

const ProfileCard = ({ text, Icon, heading, bgColor = palette.navy }) => {
  const cardVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.97 }
  };

  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        color={"black"}
        sx={{
          padding: "1rem 1.5rem",
          borderRadius: "12px",
          backgroundColor: bgColor,
          minWidth: "250px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
        }}
      >
        {Icon && (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {Icon}
          </motion.div>
        )}

        <Stack alignItems="flex-start">
          <Typography variant="body1" fontWeight="medium">
            {text}
          </Typography>
          <Typography color={palette.cream} variant="caption">
            {heading}
          </Typography>
        </Stack>
      </Stack>
    </motion.div>
  );
};

export default Profile;