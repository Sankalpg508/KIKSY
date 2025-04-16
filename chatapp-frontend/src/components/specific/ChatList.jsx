import { Stack, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatItem from "../shared/ChatItem";
import { palette } from "../../constants/color";
import { alpha } from "@mui/material/styles";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  },
  exit: { 
    opacity: 0, 
    x: -20, 
    transition: { duration: 0.2 } 
  }
};

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Create a gradient with the new dark colors
  const gradientStart = palette.Forest_Green;
  const gradientEnd = palette.Midnight_green;

  return (
    <Box 
      sx={{
        width: w,
        height: "100%",
        background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
        borderRadius: "12px",
        boxShadow: `0 4px 16px ${alpha(palette.navy, 0.25)}`,
        position: "relative",
        overflow: "hidden",
        color: palette.cream,
        "& .MuiTypography-root": {
          color: palette.creamDark
        }
      }}
    >
      <Stack 
        direction={"column"} 
        overflow={"auto"} 
        height={"100%"}
        width={"100%"}
        p={2}
        spacing={1}
        sx={{
          scrollbarWidth: "thin",
          scrollbarColor: `${palette.orange} transparent`,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: alpha(palette.Slate, 0.3),
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: palette.Deep_Terracotta,
            borderRadius: "10px",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: palette.maroon,
            }
          }
        }}
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate={mounted ? "show" : "hidden"}
          style={{ width: "100%" }}
        >
          <AnimatePresence>
            {chats?.map((data, index) => {
              const { avatar, _id, name, groupChat, members } = data;

              const newMessageAlert = newMessagesAlert.find(
                ({ chatId }) => chatId === _id
              );

              const isOnline = members?.some((member) =>
                onlineUsers.includes(member)
              );

              const isSelected = chatId === _id;

              return (
                <motion.div
                  key={_id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.05 
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <ChatItem
                    index={index}
                    newMessageAlert={newMessageAlert}
                    isOnline={isOnline}
                    avatar={avatar}
                    name={name}
                    _id={_id}
                    groupChat={groupChat}
                    sameSender={isSelected}
                    handleDeleteChat={handleDeleteChat}
                    sx={{ 
                      mb: 1,
                      backgroundColor: isSelected 
                        ? alpha(palette.Dark_Aubergine, 0.8) 
                        : alpha(palette.Slate, 0.5),
                      borderRadius: "10px",
                      boxShadow: isSelected 
                        ? `0 0 0 2px ${palette.orange}` 
                        : `0 2px 8px ${alpha(palette.navy, 0.2)}`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: isSelected 
                          ? alpha(palette.Dark_Aubergine, 0.8) 
                          : alpha(palette.Dark_Chocolate, 0.6),
                      },
                      "& .MuiTypography-root": { 
                        color: isSelected ? palette.cream : palette.creamDark,
                        fontWeight: isSelected ? "bold" : "normal"
                      },
                      "& .MuiListItemText-primary": { 
                        color: isSelected ? palette.cream : palette.creamDark,
                        fontWeight: isSelected ? "bold" : "normal"
                      },
                      "& .MuiListItemText-secondary": { 
                        color: isSelected ? palette.cream : alpha(palette.creamDark, 0.85)
                      },
                      "& .MuiListItemAvatar-root": {
                        "& .MuiAvatar-root": {
                          border: isSelected 
                            ? `2px solid ${palette.orange}` 
                            : `1px solid ${palette.blue}`,
                          background: isSelected
                            ? `linear-gradient(135deg, ${palette.maroon} 0%, ${palette.Deep_Terracotta} 100%)`
                            : `linear-gradient(135deg, ${palette.blue} 0%, ${palette.Midnight_green} 100%)`,
                          transition: "all 0.3s ease"
                        }
                      },
                      transform: isSelected ? "translateX(4px)" : "none",
                      padding: "12px",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": isSelected ? {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "4px",
                        backgroundColor: palette.orange,
                        borderRadius: "4px 0 0 4px"
                      } : {}
                    }}
                  />
                  
                  {/* Online indicator dot */}
                  {isOnline && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: palette.Forest_Green,
                        boxShadow: `0 0 0 2px ${palette.charcoal_blue}`,
                        zIndex: 2
                      }}
                    />
                  )}
                  
                  {/* New message notification */}
                  {newMessageAlert?.count > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "10px",
                        right: isOnline ? "26px" : "10px",
                        minWidth: "20px",
                        height: "20px",
                        borderRadius: "10px",
                        backgroundColor: palette.maroon,
                        color: palette.cream,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        padding: "0 6px",
                        boxShadow: `0 2px 4px ${alpha(palette.navy, 0.3)}`
                      }}
                    >
                      {newMessageAlert.count}
                    </Box>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {chats.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                padding: "2rem",
                color: palette.cream,
                textAlign: "center"
              }}
            >
              <Box
                sx={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: alpha(palette.orange, 0.2),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem"
                }}
              >
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.4876 3.36093 14.891 4 16.1272V21L8.87279 20C9.94059 20.6235 10.9344 21 12 21Z" 
                    stroke={palette.cream} 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </Box>
              <Box sx={{ fontWeight: "medium", mb: 1 }}>No conversations yet</Box>
              <Box sx={{ fontSize: "0.85rem", opacity: 0.7 }}>
                Start a new chat or wait for incoming messages
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Stack>
    </Box>
  );
};

export default ChatList;