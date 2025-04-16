import { ListItemText, Menu, MenuItem, MenuList, Tooltip, Fade, Box, alpha } from "@mui/material";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";
import {
  AudioFile as AudioFileIcon,
  Image as ImageIcon,
  UploadFile as UploadFileIcon,
  VideoFile as VideoFileIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useSendAttachmentsMutation } from "../../redux/api/api";
import { palette } from "../../constants/color";

const FileMenu = ({ anchorE1, chatId, user }) => {
  const { isFileMenu } = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const [sendAttachments] = useSendAttachmentsMutation();

  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  const selectImage = () => {
    console.log("Image selector clicked");
    imageRef.current?.click();
  };
  
  const selectAudio = () => {
    console.log("Audio selector clicked");
    audioRef.current?.click();
  };
  
  const selectVideo = () => {
    console.log("Video selector clicked");
    videoRef.current?.click();
  };
  
  const selectFile = () => {
    console.log("File selector clicked");
    fileRef.current?.click();
  };

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);
    console.log(`${key} files selected:`, files.length);

    if (files.length <= 0) return;

    if (files.length > 5)
      return toast.error(`You can only send 5 ${key} at a time`);

    dispatch(setUploadingLoader(true));

    const toastId = toast.loading(`Sending ${key}...`);
    closeFileMenu();

    try {
      const myForm = new FormData();

      myForm.append("chatId", chatId);
      files.forEach((file) => myForm.append("files", file));

      const res = await sendAttachments(myForm);

      if (res.data) {
        toast.success(`${key} sent successfully`, { id: toastId });
        
        // REMOVE THIS ENTIRE BLOCK - let socket handle it
        // if (onAttachmentSent && res.data.message) {
        //   const messageWithCorrectSender = {
        //     ...res.data.message,
        //     sender: {
        //       _id: user._id,
        //       name: user.name
        //     }
        //   };
        //   console.log("Sending attachment message to chat:", res.data.message);
        //   onAttachmentSent(messageWithCorrectSender);
        // }
      } else {
        toast.error(`Failed to send ${key}`, { id: toastId });
      }
    } catch (error) {
      toast.error(error.message || "Failed to send attachment", { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  const getIconColor = (type) => {
    switch(type) {
      case 'image': return palette.blue;
      case 'audio': return palette.orange;
      case 'video': return palette.maroon;
      case 'file': return palette.blue;
      default: return palette.navy;
    }
  };

  return (
    <Menu 
      anchorEl={anchorE1} 
      open={isFileMenu} 
      onClose={closeFileMenu}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
      PaperProps={{
        sx: {
          backgroundColor: palette.cream,
          borderRadius: '10px',
          boxShadow: `0 6px 16px ${alpha(palette.navy, 0.2)}`,
          overflow: 'hidden',
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
      <Box
        sx={{
          width: "12rem",
        }}
      >
        <MenuList>
          <MenuItem 
            onClick={selectImage}
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(palette.blue, 0.1),
                transform: 'translateX(4px)',
                borderLeft: `3px solid ${palette.blue}`,
                paddingLeft: '13px',
              },
              borderLeft: `0px solid ${palette.blue}`,
            }}
          >
            <Tooltip title="Image">
              <Box sx={{ 
                color: getIconColor('image'),
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }}>
                <ImageIcon />
              </Box>
            </Tooltip>
            <ListItemText 
              primary="Image" 
              sx={{ 
                marginLeft: "1rem",
                '& .MuiTypography-root': {
                  color: palette.navy,
                  fontWeight: 500,
                }
              }} 
            />
            <input
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Images")}
              ref={imageRef}
            />
          </MenuItem>

          <MenuItem 
            onClick={selectAudio}
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(palette.orange, 0.1),
                transform: 'translateX(4px)',
                borderLeft: `3px solid ${palette.orange}`,
                paddingLeft: '13px',
              },
              borderLeft: `0px solid ${palette.orange}`,
            }}
          >
            <Tooltip title="Audio">
              <Box sx={{ 
                color: getIconColor('audio'),
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }}>
                <AudioFileIcon />
              </Box>
            </Tooltip>
            <ListItemText 
              primary="Audio" 
              sx={{ 
                marginLeft: "1rem",
                '& .MuiTypography-root': {
                  color: palette.navy,
                  fontWeight: 500,
                }
              }}
            />
            <input
              type="file"
              multiple
              accept="audio/*"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Audios")}
              ref={audioRef}
            />
          </MenuItem>

          <MenuItem 
            onClick={selectVideo}
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(palette.maroon, 0.1),
                transform: 'translateX(4px)',
                borderLeft: `3px solid ${palette.maroon}`,
                paddingLeft: '13px',
              },
              borderLeft: `0px solid ${palette.maroon}`,
            }}
          >
            <Tooltip title="Video">
              <Box sx={{ 
                color: getIconColor('video'),
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }}>
                <VideoFileIcon />
              </Box>
            </Tooltip>
            <ListItemText 
              primary="Video" 
              sx={{ 
                marginLeft: "1rem",
                '& .MuiTypography-root': {
                  color: palette.navy,
                  fontWeight: 500,
                }
              }}
            />
            <input
              type="file"
              multiple
              accept="video/*"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Videos")}
              ref={videoRef}
            />
          </MenuItem>

          <MenuItem 
            onClick={selectFile}
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(palette.blue, 0.1),
                transform: 'translateX(4px)',
                borderLeft: `3px solid ${palette.blue}`,
                paddingLeft: '13px',
              },
              borderLeft: `0px solid ${palette.blue}`,
            }}
          >
            <Tooltip title="File">
              <Box sx={{ 
                color: getIconColor('file'),
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }}>
                <UploadFileIcon />
              </Box>
            </Tooltip>
            <ListItemText 
              primary="File" 
              sx={{ 
                marginLeft: "1rem",
                '& .MuiTypography-root': {
                  color: palette.navy,
                  fontWeight: 500,
                }
              }}
            />
            <input
              type="file"
              multiple
              accept="*"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Files")}
              ref={fileRef}
            />
          </MenuItem>
        </MenuList>
      </Box>
    </Menu>
  );
};

export default FileMenu;