import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
  Zoom,
  Fade,
  Divider,
} from "@mui/material";
import React, { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";
import { palette } from "../../constants/color";
import { transformImage } from "../../lib/features";

const Notifications = () => {
  const { isNotification } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);
  const [processingRequests, setProcessingRequests] = useState([]);

  const friendRequestHandler = async ({ _id, accept }) => {
    setProcessingRequests(prev => [...prev, _id]);
    await acceptRequest("Accepting...", { requestId: _id, accept });
    setProcessingRequests(prev => prev.filter(id => id !== _id));
    
    // Only close if there are no more notifications
    if (data?.allRequests?.length <= 1) {
      dispatch(setIsNotification(false));
    }
  };

  const closeHandler = () => dispatch(setIsNotification(false));

  useErrors([{ error, isError }]);

  return (
    <Dialog 
      open={isNotification} 
      onClose={closeHandler}
      TransitionComponent={Zoom}
      transitionDuration={400}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          backgroundColor: palette.cream,
          overflow: "hidden",
          minWidth: { xs: "90%", sm: "400px" },
          maxWidth: "500px"
        }
      }}
    >
      <Stack 
        p={{ xs: "1.5rem", sm: "2rem" }}
        sx={{
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "5px",
            background: `linear-gradient(to right, ${palette.blue}, ${palette.orange})`,
          }
        }}
      >
        <Fade in={isNotification} timeout={600}>
          <DialogTitle 
            sx={{ 
              color: palette.navy,
              fontWeight: 600,
              fontSize: { xs: "1.5rem", sm: "1.8rem" },
              textAlign: "center",
              mb: 2,
              padding: 0
            }}
          >
            Notifications
          </DialogTitle>
        </Fade>

        <Divider sx={{ mb: 2, bgcolor: `${palette.blue}30` }} />

        {isLoading ? (
          <Stack spacing={2}>
            {[1, 2].map((item) => (
              <Skeleton 
                key={item} 
                variant="rectangular" 
                height={80} 
                sx={{ borderRadius: "8px" }} 
              />
            ))}
          </Stack>
        ) : (
          <AnimatePresence>
            {data?.allRequests?.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Stack spacing={1} maxHeight="400px" overflow="auto">
                  {data?.allRequests?.map(({ sender, _id }, index) => (
                    <motion.div
                      key={_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <NotificationItem
                        sender={sender}
                        _id={_id}
                        handler={friendRequestHandler}
                        isProcessing={processingRequests.includes(_id)}
                      />
                    </motion.div>
                  ))}
                </Stack>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Stack 
                  alignItems="center" 
                  justifyContent="center" 
                  spacing={2} 
                  py={4}
                >
                  <Typography 
                    textAlign={"center"} 
                    variant="h6"
                    sx={{ color: palette.navy }}
                  >
                    No notifications
                  </Typography>
                  <Typography 
                    textAlign={"center"} 
                    variant="body2"
                    sx={{ color: palette.blue, opacity: 0.8 }}
                  >
                    You're all caught up!
                  </Typography>
                </Stack>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler, isProcessing }) => {
  const { name, avatar } = sender;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <ListItem 
      sx={{ 
        px: 1, 
        py: 1.5,
        borderRadius: "8px",
        backgroundColor: isHovered ? `${palette.blue}15` : "transparent",
        transition: "all 0.3s ease",
        mb: 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Avatar 
            src={transformImage(avatar)} 
            sx={{ 
              width: 48, 
              height: 48,
              border: `2px solid ${palette.blue}`,
              backgroundColor: palette.navy
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
            fontWeight: 500
          }}
        >
          <span style={{ fontWeight: 600 }}>{name}</span> sent you a friend request.
        </Typography>

        <Stack
          direction={{
            xs: "row",
            sm: "row",
          }}
          spacing={1}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => handler({ _id, accept: true })}
              disabled={isProcessing}
              sx={{
                bgcolor: palette.blue,
                color: palette.cream,
                "&:hover": {
                  bgcolor: palette.navy,
                },
                minWidth: "80px"
              }}
            >
              Accept
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              color="error" 
              onClick={() => handler({ _id, accept: false })}
              disabled={isProcessing}
              sx={{
                color: palette.maroon,
                borderColor: palette.maroon,
                "&:hover": {
                  backgroundColor: `${palette.maroon}15`,
                  borderColor: palette.maroon,
                },
                minWidth: "80px"
              }}
              variant="outlined"
            >
              Reject
            </Button>
          </motion.div>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications;