import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import { transformImage } from "../../lib/features";
import { palette } from "../../constants/color";

const UserItem = ({
  user,
  handler,
  handlerIsLoading,
  isAdded = false,
  styling = {},
}) => {
  const { name, _id, avatar } = user;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <ListItem
        sx={{
          borderRadius: "8px",
          mb: 1,
          background: isHovered ? `${palette.cream}30` : "transparent",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={"1rem"}
          width={"100%"}
          sx={styling}  // Changed from {...styling} to sx={styling}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Avatar 
              src={transformImage(avatar)} 
              sx={{ 
                border: `2px solid ${isAdded ? palette.orange : palette.blue}`,
                transition: "border-color 0.3s ease"
              }}
            />
          </motion.div>

          <Typography
            variant="body1"
            sx={{
              flexGrow: 1,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
              color: palette.navy,
              fontWeight: isHovered ? 500 : 400,
              transition: "all 0.3s ease",
            }}
          >
            {name}
          </Typography>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconButton
              size="small"
              sx={{
                bgcolor: isAdded ? palette.maroon : palette.blue,
                color: palette.cream,
                "&:hover": {
                  bgcolor: isAdded ? palette.maroon : palette.blue,
                  opacity: 0.9,
                },
                transition: "all 0.3s ease",
                boxShadow: isHovered ? "0px 4px 8px rgba(0, 0, 0, 0.15)" : "none",
              }}
              onClick={() => handler(_id)}
              disabled={handlerIsLoading}
            >
              {isAdded ? <RemoveIcon /> : <AddIcon />}
            </IconButton>
          </motion.div>
        </Stack>
      </ListItem>
    </motion.div>
  );
};

export default memo(UserItem);