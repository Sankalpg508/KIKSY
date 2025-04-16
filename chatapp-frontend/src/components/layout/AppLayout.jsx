import { Drawer, Grid, Skeleton, Box, styled, keyframes, alpha } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getOrSaveFromStorage } from "../../lib/features";
import { useMyChatsQuery } from "../../redux/api/api";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";
import { LayoutLoader } from "../layout/Loaders";

// Color palette
import { palette } from "../../constants/color";

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    transform: translateX(-30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInRight = keyframes`
  from {
    transform: translateX(30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Styled components
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    background: `linear-gradient(135deg, ${palette.cream} 0%, ${alpha(palette.cream, 0.9)} 100%)`,
    boxShadow: `5px 0 20px ${alpha(palette.navy, 0.3)}`,
    borderRight: `1px solid ${alpha(palette.navy, 0.1)}`,
  },
}));

const AnimatedChatListWrapper = styled(Box)(({ theme }) => ({
  animation: `${slideInLeft} 0.5s ease-out`,
  height: '100%',
  borderRight: `1px solid ${alpha(palette.navy, 0.1)}`,
}));

const AnimatedMainContentWrapper = styled(Box)(({ theme }) => ({
  animation: `${fadeIn} 0.5s ease-out`,
  height: '100%',
  padding: '0.5rem',
  background: `linear-gradient(135deg, ${alpha(palette.cream, 0.1)} 0%, ${alpha(palette.blue, 0.05)} 100%)`,
}));

const AnimatedProfileWrapper = styled(Box)(({ theme }) => ({
  animation: `${slideInRight} 0.5s ease-out`,
  height: '100%',
  padding: '2rem',
  background: `linear-gradient(180deg, ${palette.navy} 0%, ${alpha(palette.blue, 0.9)} 100%)`,
  boxShadow: `-5px 0 20px ${alpha(palette.navy, 0.3)}`,
  borderLeft: `1px solid ${alpha(palette.blue, 0.3)}`,
}));

const StyledSkeleton = styled(Skeleton)(({ theme }) => ({
  background: `linear-gradient(90deg, ${alpha(palette.cream, 0.1)} 25%, ${alpha(palette.blue, 0.2)} 50%, ${alpha(palette.cream, 0.1)} 75%)`,
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite linear`,
  borderRadius: '8px',
}));

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = getSocket();

    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);

    const [onlineUsers, setOnlineUsers] = useState([]);
    const [fadeIn, setFadeIn] = useState(false);

    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    useEffect(() => {
      // Set fadeIn to true after components mount for animation
      const timer = setTimeout(() => setFadeIn(true), 100);
      return () => clearTimeout(timer);
    }, []);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId, dispatch]
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);

    return (
      <>
        <Title />
        <Header />

        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />

        {isLoading ? (
          <StyledSkeleton height="4rem" />
        ) : (
          <StyledDrawer 
            open={isMobile} 
            onClose={handleMobileClose}
            transitionDuration={300}
          >
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
            />
          </StyledDrawer>
        )}

        {isLoading ? (
          <LayoutLoader />
        ) : (
          <Grid container height={"calc(100vh - 4rem)"}>
            <Grid
              item
              sm={4}
              md={3}
              sx={{
                display: { xs: "none", sm: "block" },
              }}
              height={"100%"}
            >
              <AnimatedChatListWrapper>
                <ChatList
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                  newMessagesAlert={newMessagesAlert}
                  onlineUsers={onlineUsers}
                />
              </AnimatedChatListWrapper>
            </Grid>
            <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
              <AnimatedMainContentWrapper>
                <WrappedComponent {...props} chatId={chatId} user={user} />
              </AnimatedMainContentWrapper>
            </Grid>

            <Grid
              item
              md={4}
              lg={3}
              height={"100%"}
              sx={{
                display: { xs: "none", md: "block" },
              }}
            >
              <AnimatedProfileWrapper>
                <Profile user={user} />
              </AnimatedProfileWrapper>
            </Grid>
          </Grid>
        )}
      </>
    );
  };
};

export default AppLayout;