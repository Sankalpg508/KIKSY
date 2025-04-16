import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  styled,
  keyframes,
  alpha,
} from "@mui/material";
import React, { Suspense, lazy, useState } from "react";
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";

// Color palette
const palette = {
  'navy': '#001524',
  'blue': '#15616D',
  'cream': '#FFECD1',
  'orange': '#FF7D00',
  'maroon': '#78290F',
};

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
`;

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${palette.navy} 0%, ${palette.blue} 100%)`,
  boxShadow: `0 4px 20px ${alpha(palette.navy, 0.5)}`,
  animation: `${fadeIn} 0.5s ease-out`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: `linear-gradient(90deg, ${palette.cream}, ${palette.orange}, ${palette.maroon}, ${palette.orange}, ${palette.cream})`,
    backgroundSize: '500% 100%',
    animation: 'shimmer 3s infinite linear',
  },
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '0% 0%',
    },
    '100%': {
      backgroundPosition: '100% 0%',
    },
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: palette.cream,
  letterSpacing: '0.1em',
  textShadow: `2px 2px 4px ${alpha(palette.navy, 0.5)}`,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    letterSpacing: '0.15em',
    color: palette.orange,
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: palette.cream,
  transition: 'all 0.3s ease',
  margin: '0 4px',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 0,
    height: '2px',
    backgroundColor: palette.orange,
    transition: 'all 0.3s ease',
  },
  '&:hover': {
    backgroundColor: alpha(palette.cream, 0.1),
    transform: 'translateY(-2px)',
    color: palette.orange,
    '&::after': {
      width: '80%',
      left: '10%',
    },
  },
}));

const AnimatedBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: palette.maroon,
    animation: `${pulse} 2s infinite ease-in-out`,
    boxShadow: `0 0 10px ${palette.maroon}`,
  },
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  color: palette.cream,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(palette.cream, 0.1),
    transform: 'rotate(90deg)',
  },
}));

const IconButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& > *': {
    animation: `${fadeIn} 0.5s ease-out`,
  },
  '& > *:nth-of-type(1)': { animationDelay: '0.1s' },
  '& > *:nth-of-type(2)': { animationDelay: '0.2s' },
  '& > *:nth-of-type(3)': { animationDelay: '0.3s' },
  '& > *:nth-of-type(4)': { animationDelay: '0.4s' },
  '& > *:nth-of-type(5)': { animationDelay: '0.5s' },
}));

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  backgroundColor: alpha(palette.navy, 0.8),
  backdropFilter: 'blur(5px)',
  zIndex: theme.zIndex.drawer + 1,
}));

// Lazy loaded components
const SearchDialog = lazy(() => import("../specific/Search"));
const NotifcationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);

  const handleMobile = () => dispatch(setIsMobile(true));

  const openSearch = () => dispatch(setIsSearch(true));

  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };

  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const navigateToGroup = () => navigate("/groups");

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <StyledAppBar position="static">
          <Toolbar>
            <LogoText
              variant="h6"
              sx={{
                display: { xs: "none", sm: "block" },
              }}
              onClick={() => navigate("/")}
            >
              Kiksy
            </LogoText>

            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <MenuButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </MenuButton>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
              }}
            />
            <IconButtonsContainer>
              <IconBtn
                title={"Search"}
                icon={<SearchIcon />}
                onClick={openSearch}
                animation={bounce}
              />

              <IconBtn
                title={"New Group"}
                icon={<AddIcon />}
                onClick={openNewGroup}
                animation={pulse}
              />

              <IconBtn
                title={"Manage Groups"}
                icon={<GroupIcon />}
                onClick={navigateToGroup}
                animation={bounce}
              />

              <IconBtn
                title={"Notifications"}
                icon={<NotificationsIcon />}
                onClick={openNotification}
                value={notificationCount}
                animation={notificationCount ? pulse : bounce}
              />

              <IconBtn
                title={"Logout"}
                icon={<LogoutIcon />}
                onClick={logoutHandler}
                animation={bounce}
              />
            </IconButtonsContainer>
          </Toolbar>
        </StyledAppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<StyledBackdrop open />}>
          <SearchDialog />
        </Suspense>
      )}

      {isNotification && (
        <Suspense fallback={<StyledBackdrop open />}>
          <NotifcationDialog />
        </Suspense>
      )}

      {isNewGroup && (
        <Suspense fallback={<StyledBackdrop open />}>
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
};

const IconBtn = ({ title, icon, onClick, value, animation }) => {
  const animationStyle = animation
    ? {
        '&:hover .icon-wrapper': {
          animation: `${animation} 0.6s ease-in-out`,
        },
      }
    : {};

  return (
    <Tooltip 
      title={title}
      arrow
      placement="bottom"
      sx={{
        '& .MuiTooltip-tooltip': {
          backgroundColor: palette.navy,
          color: palette.cream,
          boxShadow: `0 4px 6px ${alpha(palette.navy, 0.25)}`,
          fontSize: '0.75rem',
        },
        '& .MuiTooltip-arrow': {
          color: palette.navy,
        },
      }}
    >
      <StyledIconButton 
        color="inherit" 
        size="large" 
        onClick={onClick}
        sx={animationStyle}
      >
        <Box className="icon-wrapper">
          {value ? (
            <AnimatedBadge badgeContent={value} color="error">
              {icon}
            </AnimatedBadge>
          ) : (
            icon
          )}
        </Box>
      </StyledIconButton>
    </Tooltip>
  );
};

export default Header;