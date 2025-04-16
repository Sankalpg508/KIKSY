import { Menu, Stack, Typography, Fade, Box, alpha } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../redux/reducers/misc";
import {
  Delete as DeleteIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useDeleteChatMutation,
  useLeaveGroupMutation,
} from "../../redux/api/api";
import { palette } from "../../constants/color";

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {
  const navigate = useNavigate();

  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc
  );

  const [deleteChat, _, deleteChatData] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [leaveGroup, __, leaveGroupData] = useAsyncMutation(
    useLeaveGroupMutation
  );

  const isGroup = selectedDeleteChat.groupChat;

  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
    deleteMenuAnchor.current = null;
  };

  const leaveGroupHandler = () => {
    closeHandler();
    leaveGroup("Leaving Group...", selectedDeleteChat.chatId);
  };

  const deleteChatHandler = () => {
    closeHandler();
    deleteChat("Deleting Chat...", selectedDeleteChat.chatId);
  };

  useEffect(() => {
    if (deleteChatData || leaveGroupData) navigate("/");
  }, [deleteChatData, leaveGroupData]);

  return (
    <Menu
      open={isDeleteMenu}
      onClose={closeHandler}
      anchorEl={deleteMenuAnchor.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
      PaperProps={{
        sx: {
          backgroundColor: palette.cream,
          borderRadius: '8px',
          boxShadow: `0 6px 16px ${alpha(palette.navy, 0.2)}`,
          overflow: 'hidden',
          border: `1px solid ${alpha(palette.blue, 0.2)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${palette.blue}, ${palette.orange})`,
          }
        }
      }}
    >
      <Stack
        sx={{
          width: "12rem",
          padding: "0.8rem",
          cursor: "pointer",
          '&:hover': {
            backgroundColor: alpha(isGroup ? palette.blue : palette.maroon, 0.1),
            transform: 'translateX(4px)',
            transition: 'all 0.3s ease',
          },
          transition: 'all 0.3s ease',
          borderLeft: `3px solid ${isGroup ? palette.blue : palette.maroon}`,
          borderRadius: '0 4px 4px 0',
        }}
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
      >
        {isGroup ? (
          <>
            <Box sx={{ 
              color: palette.blue,
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateX(2px)' }
            }}>
              <ExitToAppIcon />
            </Box>
            <Typography sx={{ 
              color: palette.navy,
              fontWeight: 500,
              transition: 'color 0.3s ease',
              '&:hover': { color: palette.blue }
            }}>
              Leave Group
            </Typography>
          </>
        ) : (
          <>
            <Box sx={{ 
              color: palette.maroon,
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateX(2px)' }
            }}>
              <DeleteIcon />
            </Box>
            <Typography sx={{ 
              color: palette.navy,
              fontWeight: 500,
              transition: 'color 0.3s ease',
              '&:hover': { color: palette.maroon }
            }}>
              Delete Chat
            </Typography>
          </>
        )}
      </Stack>
    </Menu>
  );
};

export default DeleteChatMenu;