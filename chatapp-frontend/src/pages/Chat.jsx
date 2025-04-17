import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack, Typography, Menu, MenuItem, Divider, Paper } from "@mui/material";
import { palette } from "../constants/color"; // Import color palette
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  Search as SearchIcon,
  Reply as ReplyIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponents";
import FileMenu from "../components/dialogs/FileMenu";
import { 
  
  InsertDriveFile as InsertDriveFileIcon,
  MusicNote as MusicNoteIcon,
  PictureAsPdf as PictureAsPdfIcon,
  PlayCircleOutline as PlayCircleOutlineIcon
} from "@mui/icons-material";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loaders";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../components/shared/SearchBar";



const getFormattedTime = (dateString) => {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return "Just now";
    }
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Just now"; // Return a fallback string
  }
};

// Updated MessageComponent to handle message alignment and safe date formatting
// Updated EnhancedMessageComponent with improved attachment handling
// Updated EnhancedMessageComponent with improved attachment handling
// Updated EnhancedMessageComponent with fixed attachment alignment
const EnhancedMessageComponent = ({ message, user, onReply }) => {
  const isMyMessage = message.sender?._id === user?._id;
  const [contextMenu, setContextMenu] = useState(null);
  
  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX, mouseY: event.clientY }
        : null,
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleReplyClick = () => {
    onReply(message);
    handleClose();
  };
  
  // Function to render appropriate attachment based on type
  const renderAttachment = (attachment) => {
    // Get file extension from filename
    const fileExtension = attachment.filename 
      ? attachment.filename.split('.').pop().toLowerCase() 
      : '';
    
    // Determine file type based on extension or mimetype
    const fileType = attachment.mimetype || getFileTypeFromExtension(fileExtension);
    
    if (fileType.startsWith('image/')) {
      // Render image preview
      return (
        <div 
          style={{
            borderRadius: '8px',
            overflow: 'hidden',
            marginTop: '8px',
            position: 'relative',
            maxWidth: '250px',
          }}
        >
          <img 
            src={attachment.url || attachment.path} 
            alt={attachment.filename || "Image"} 
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '200px',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'fallback-image-url'; // Add a fallback image URL here
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: '4px',
            padding: '2px 6px',
          }}>
            <Typography variant="caption" sx={{ color: 'white' }}>
              {getFileSize(attachment.size)}
            </Typography>
          </div>
        </div>
      );
    } 
    else if (fileType.startsWith('video/')) {
      // Render video thumbnail with play button
      return (
        <div 
          style={{
            borderRadius: '8px',
            overflow: 'hidden',
            marginTop: '8px',
            position: 'relative',
            maxWidth: '250px',
            cursor: 'pointer',
          }}
          onClick={() => window.open(attachment.url || attachment.path, '_blank')}
        >
          <div style={{
            backgroundColor: isMyMessage ? palette.navy : palette.cream,
            color: isMyMessage ? 'white' : palette.navy,
            padding: '30px 8px',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <PlayCircleOutlineIcon sx={{ fontSize: '48px', color: isMyMessage ? palette.cream : palette.navy }} />
            <Typography variant="caption" sx={{ marginTop: '8px' }}>
              {attachment.filename || "Video"}
            </Typography>
          </div>
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: '4px',
            padding: '2px 6px',
          }}>
            <Typography variant="caption" sx={{ color: 'white' }}>
              {getFileSize(attachment.size)}
            </Typography>
          </div>
        </div>
      );
    } 
    else if (fileType.startsWith('audio/')) {
      // Render audio player style
      return (
        <div 
          style={{
            backgroundColor: isMyMessage ? palette.navy : palette.cream,
            color: isMyMessage ? 'white' : palette.navy,
            padding: '12px',
            borderRadius: '12px',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '250px',
            cursor: 'pointer',
          }}
          onClick={() => window.open(attachment.url || attachment.path, '_blank')}
        >
          <MusicNoteIcon sx={{ color: isMyMessage ? palette.cream : palette.navy }} />
          <div>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {attachment.filename || "Audio file"}
            </Typography>
            <Typography variant="caption">
              {getFileSize(attachment.size)}
            </Typography>
          </div>
        </div>
      );
    } 
    else if (fileType === 'application/pdf') {
      // Render PDF document style
      return (
        <div 
          style={{
            backgroundColor: isMyMessage ? palette.navy : palette.cream,
            color: isMyMessage ? 'white' : palette.navy,
            padding: '12px',
            borderRadius: '12px',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '250px',
            cursor: 'pointer',
          }}
          onClick={() => window.open(attachment.url || attachment.path, '_blank')}
        >
          <PictureAsPdfIcon sx={{ color: '#ff5722' }} />
          <div>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {attachment.filename || "PDF Document"}
            </Typography>
            <Typography variant="caption">
              {getFileSize(attachment.size)}
            </Typography>
          </div>
        </div>
      );
    } 
    else {
      // Default file style for other types
      return (
        <div 
          style={{
            backgroundColor: isMyMessage ? palette.navy : palette.cream,
            color: isMyMessage ? 'white' : palette.navy,
            padding: '12px',
            borderRadius: '12px',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '250px',
            cursor: 'pointer',
          }}
          onClick={() => window.open(attachment.url || attachment.path, '_blank')}
        >
          <InsertDriveFileIcon sx={{ color: isMyMessage ? palette.cream : palette.navy }} />
          <div>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {attachment.filename || "File"}
            </Typography>
            <Typography variant="caption">
              {getFileSize(attachment.size)}
            </Typography>
          </div>
        </div>
      );
    }
  };
  
  // Display the reply reference if this message is a reply
  const replyContent = message.replyTo && (
    <Paper 
      elevation={0}
      sx={{
        backgroundColor: isMyMessage 
          ? `${palette.navy}40` 
          : `${palette.navy}20`,
        padding: "8px 12px",
        borderRadius: "8px",
        marginBottom: "8px",
        borderLeft: `3px solid ${isMyMessage ? palette.cream : palette.navy}`,
      }}
    >
      <Typography 
        variant="caption" 
        sx={{ 
          fontWeight: "bold", 
          color: isMyMessage ? palette.cream : palette.navy 
        }}
      >
        {message.replyTo.sender?.name || "Unknown"}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          fontSize: "0.8rem", 
          color: isMyMessage ? "rgba(255,255,255,0.8)" : palette.navy,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "200px"
        }}
      >
        {message.replyTo.content || (message.replyTo.attachments?.length > 0 ? "[Attachment]" : "")}
      </Typography>
    </Paper>
  );
  
  return (
    <Stack
      direction="row"
      justifyContent={isMyMessage ? "flex-end" : "flex-start"}
      width="100%"
      onContextMenu={handleContextMenu}
    >
      <Stack
        sx={{
          maxWidth: "75%",
          backgroundColor: isMyMessage ? palette.Dark_Aubergine : palette.cream,
          color: isMyMessage ? "white" : palette.navy,
          padding: "12px 16px",
          borderRadius: isMyMessage 
            ? "18px 18px 0 18px"
            : "18px 18px 18px 0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {message.sender?.name !== "Admin" && (
          <Typography
            variant="caption"
            sx={{
              fontWeight: "bold",
              color: isMyMessage ? palette.cream : palette.navy,
              marginBottom: "4px",
            }}
          >
            {message.sender?.name}
          </Typography>
        )}
        
        {/* Display the reply reference if this message is a reply */}
        {replyContent}
        
        {/* Show message content if it exists */}
        {message.content && (
          <Typography variant="body1">{message.content}</Typography>
        )}
        
        {/* Render attachments if they exist */}
        {message.attachments && message.attachments.length > 0 && (
          <Stack spacing={1} mt={message.content ? 1 : 0}>
            {message.attachments.map((attachment, index) => (
              <div key={index}>
                {renderAttachment(attachment)}
              </div>
            ))}
          </Stack>
        )}
        
        <Typography
          variant="caption"
          sx={{
            alignSelf: isMyMessage ? "flex-start" : "flex-end",
            opacity: 0.7,
            marginTop: "4px",
            fontSize: "0.7rem",
          }}
        >
          {getFormattedTime(message.createdAt)}
        </Typography>
      </Stack>
      
      {/* Context Menu for Reply */}
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleReplyClick}>
          <ReplyIcon fontSize="small" sx={{ mr: 1 }} />
          Reply
        </MenuItem>
      </Menu>
    </Stack>
  );
};

// Helper function to get file type from extension
const getFileTypeFromExtension = (extension) => {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const videoTypes = ['mp4', 'webm', 'mov', 'avi', 'mkv'];
  const audioTypes = ['mp3', 'wav', 'ogg', 'aac'];
  const documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
  
  if (imageTypes.includes(extension)) return 'image/' + extension;
  if (videoTypes.includes(extension)) return 'video/' + extension;
  if (audioTypes.includes(extension)) return 'audio/' + extension;
  if (extension === 'pdf') return 'application/pdf';
  if (documentTypes.includes(extension)) return 'application/document';
  
  return 'application/octet-stream'; // Default type
};

// Helper function to format file size
const getFileSize = (bytes) => {
  if (!bytes) return '';
  
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const Chat = ({ chatId, user }) => {
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const prevScrollPos = useRef(0);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const tempId = Date.now().toString(); // Generates a temporary unique ID

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;
  const handleSearchMessages = (query) => {
    if (!query.trim()) {
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    const filtered = allMessages.filter(message => 
      message.content && 
      message.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMessages(filtered);
  };
  
  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [2000]);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop } = containerRef.current;
      
      // If scrolling up and beyond a threshold, show search bar
      if (prevScrollPos.current > scrollTop && scrollTop < 100) {
        setIsSearchBarVisible(true);
      } 
      // If scrolling down significantly, hide search bar
      else if (prevScrollPos.current < scrollTop && scrollTop > 200) {
        setIsSearchBarVisible(false);
      }
      
      prevScrollPos.current = scrollTop;
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  const handleReply = (message) => {
    setReplyingTo(message);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;
    const newMessage = {
      _id: tempId,
      content: message,
      sender: {
        _id: user._id,
        name: user.name
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
      replyTo: replyingTo
    };
    setMessages(prev => [...prev, newMessage]);

    socket.emit(NEW_MESSAGE, { 
      chatId, 
      members, 
      message,
      replyToId: replyingTo?._id
    });
    
    setMessage("");
    setReplyingTo(null);
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
  
      if (data.message) {
        // Ensure createdAt is valid
        if (!data.message.createdAt) {
          data.message.createdAt = new Date().toISOString();
        }
        
        // Only add if message doesn't exist in state already
        setMessages((prev) => {
          // Check if we already have this message (by server ID or matching content/time)
          const exists = prev.some(
            msg => 
              (msg._id === data.message._id) || 
              (msg.content === data.message.content && 
               Math.abs(new Date(msg.createdAt) - new Date(data.message.createdAt)) < 1000)
          );
          if (exists) return prev;
          return [...prev, data.message];
        });
      }
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  // Handler for new attachment messages
  const fileMessageHandler = useCallback(
    (newMessage) => {
      console.log("Received file message:", newMessage);
      if (newMessage?.attachments) {
        console.log("Attachments:", newMessage.attachments);
      }
      if (newMessage && newMessage.chat === chatId) {
        // Ensure createdAt is valid
        if (!newMessage.createdAt) {
          newMessage.createdAt = new Date().toISOString();
        }
        if (!newMessage.sender) {
          newMessage.sender = {
            _id: user._id,
            name: user.name
          };
        }
        setMessages((prev) => [...prev, newMessage]);
        if (bottomRef.current) {
          bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    [chatId]
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  // Enhanced animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const messageContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const messageItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 15
      }
    }
  };

  const formVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24,
        delay: 0.3
      }
    }
  };

  const buttonVariants = {
    rest: { 
      scale: 1,
      rotate: "-30deg", 
      backgroundColor: palette.orange
    },
    hover: { 
      scale: 1.15,
      rotate: "0deg",
      backgroundColor: palette.maroon,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 400
      }
    },
    tap: { 
      scale: 0.9, 
      rotate: "-10deg",
      transition: { duration: 0.1 }
    }
  };

  const attachButtonVariants = {
    rest: { 
      scale: 1,
      rotate: "30deg" 
    },
    hover: { 
      scale: 1.15,
      rotate: "45deg",
      color: palette.orange,
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 400
      }
    },
    tap: { 
      scale: 0.9, 
      rotate: "15deg",
      transition: { duration: 0.1 }
    }
  };

  const typingVariants = {
    initial: { opacity: 0, scale: 0.8, y: 10 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 10, 
      transition: { 
        duration: 0.2 
      }
    }
  };

  const toggleSearchBar = () => {
    setIsSearchBarVisible(prev => !prev);
    if (isSearching) {
      setIsSearching(false);
      setFilteredMessages([]);
    }
  };

  return chatDetails.isLoading ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Skeleton 
        variant="rounded" 
        height="90vh" 
        width="100%" 
        animation="wave" 
        sx={{ 
          bgcolor: `${palette.navy}22`,
          borderRadius: "12px"
        }} 
      />
    </motion.div>
  ) : (
    <Fragment>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ height: "100%" }}
      >
        <motion.div
          variants={messageContainerVariants}
          initial="hidden"
          animate="visible"
          style={{ height: replyingTo ? "80%" : isSearchBarVisible ? "85%" : "90%" }}
        >
          <Stack
            ref={containerRef}
            boxSizing={"border-box"}
            padding={"1rem"}
            spacing={"1rem"}
            bgcolor={palette.Dark_Chocolate}
            height={"100%"}
            sx={{
              overflowX: "hidden",
              overflowY: "auto",
              borderRadius: "12px 12px 0 0",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              scrollbarWidth: "thin",
              scrollbarColor: `${palette.navy} transparent`,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: palette.navy,
                borderRadius: "20px",
              }
            }}
          >
            {/* Search button and search bar */}
            <Stack direction="row" justifyContent="flex-end" alignItems="center" mb={1}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton 
                  onClick={toggleSearchBar}
                  sx={{ 
                    color: "white",
                    backgroundColor: `${palette.navy}50`,
                    "&:hover": {
                      backgroundColor: palette.navy
                    }
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </motion.div>
            </Stack>
            
            <AnimatePresence>
              {isSearchBarVisible && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ marginBottom: "8px" }}
                >
                  <SearchBar 
                    placeholder="Search messages..." 
                    onSearch={handleSearchMessages}
                    sx={{ 
                      padding: "0",
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      }
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
           
           <AnimatePresence mode="sync">
            {(isSearching ? filteredMessages : allMessages).map((message, index) => (
              <motion.div
                key={message._id || index}
                variants={messageItemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
              >
                <EnhancedMessageComponent message={message} user={user} onReply={handleReply} />
              </motion.div>
            ))}
           </AnimatePresence>
            
            {isSearching && filteredMessages.length === 0 && (
            <Typography 
              variant="body1" 
              sx={{ textAlign: 'center', color: palette.cream, mt: 2 }}
            >
              No messages matching your search
            </Typography>
          )}

            <AnimatePresence>
              {userTyping && (
                <motion.div
                  variants={typingVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ 
                    alignSelf: "flex-start",
                    marginLeft: "8px" 
                  }}
                >
                  <TypingLoader 
                    sx={{
                      backgroundColor: palette.creamDark,
                      borderRadius: "12px 12px 12px 0",
                      padding: "8px 16px",
                      color: palette.navy
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={bottomRef} />
          </Stack>
        </motion.div>

        {/* Reply preview component */}
        <AnimatePresence>
          {replyingTo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Stack 
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  backgroundColor: `${palette.navy}80`,
                  padding: "0.5rem 1rem",
                  borderRadius: "8px 8px 0 0",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ReplyIcon sx={{ color: palette.cream }} />
                  <Stack>
                    <Typography 
                      variant="caption" 
                      sx={{ fontWeight: "bold", color: palette.cream }}
                    >
                      Replying to {replyingTo.sender?.name || "message"}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: "rgba(255,255,255,0.8)",
                        fontSize: "0.8rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "250px"
                      }}
                    >
                      {replyingTo.content || (replyingTo.attachments?.length > 0 ? "[Attachment]" : "")}
                    </Typography>
                  </Stack>
                </Stack>
                <IconButton size="small" onClick={cancelReply} sx={{ color: palette.cream }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          style={{
            height: "10%",
          }}
          onSubmit={submitHandler}
          initial="hidden"
          animate="visible"
          variants={formVariants}
        >
          <Stack
            direction={"row"}
            height={"100%"}
            padding={"1rem"}
            alignItems={"center"}
            position={"relative"}
            sx={{
              backgroundColor: palette.navy,
              borderRadius: "0 0 12px 12px",
              boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.05)",
            }}
          >
            <motion.div
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              variants={attachButtonVariants}
            >
              <IconButton
                sx={{
                  color: "white",
                  zIndex: 10,
                }}
                onClick={handleFileOpen}
              >
                <AttachFileIcon />
              </IconButton>
            </motion.div>

            <InputBox
              placeholder="Type Message Here..."
              value={message}
              onChange={messageOnChange}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "24px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                border: `1px solid ${palette.cream}`,
                padding: "12px 16px 12px 48px",
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
                '&:focus-within': {
                  boxShadow: `0 0 0 2px ${palette.blue}33`,
                  border: `1px solid ${palette.blue}`,
                },
              }}
            />

            <motion.div
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              style={{ marginLeft: "1rem" }}
            >
              <IconButton
                type="submit"
                sx={{
                  color: "white",
                  padding: "0.6rem",
                  transition: "all 0.3s ease",
                }}
              >
                <SendIcon />
              </IconButton>
            </motion.div>
          </Stack>
        </motion.form>
      </motion.div>

      <FileMenu 
        anchorE1={fileMenuAnchor} 
        chatId={chatId} 
        // onAttachmentSent={fileMessageHandler}
        // user={user} 
      />
    </Fragment>
  );
};

export default AppLayout()(Chat);