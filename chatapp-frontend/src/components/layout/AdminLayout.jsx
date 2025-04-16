import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  Groups as GroupsIcon,
  ManageAccounts as ManageAccountsIcon,
  Menu as MenuIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Typography,
  styled,
  useTheme,
  alpha,
} from "@mui/material";
import React, { useState } from "react";
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../redux/thunks/admin";
import { keyframes } from "@mui/system";

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

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Enhanced styled components
const Link = styled(LinkComponent)(({ theme }) => ({
  textDecoration: 'none',
  borderRadius: '2rem',
  padding: '1rem 2rem',
  color: palette.navy,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    color: palette.blue,
    backgroundColor: alpha(palette.cream, 0.3),
    transform: 'translateX(5px)',
  },
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
  '&:hover::after': {
    width: '80%',
    left: '10%',
  }
}));

const AnimatedIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.2) rotate(5deg)',
  }
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  textTransform: 'uppercase',
  color: palette.navy,
  letterSpacing: '0.1em',
  animation: `${pulse} 2s infinite ease-in-out`,
  textShadow: `2px 2px 4px ${alpha(palette.navy, 0.2)}`,
}));

const SidebarContainer = styled(Stack)(({ theme }) => ({
  background: `linear-gradient(135deg, ${palette.cream} 0%, ${alpha(palette.cream, 0.9)} 100%)`,
  boxShadow: `0 4px 20px ${alpha(palette.navy, 0.15)}`,
  borderRadius: '0 20px 20px 0',
  animation: `${fadeIn} 0.5s ease-out`,
}));

const activeTabStyle = {
  bgcolor: palette.navy,
  color: palette.cream,
  boxShadow: `0 4px 10px ${alpha(palette.navy, 0.3)}`,
  transform: 'translateX(5px)',
  "&:hover": {
    color: palette.cream,
    bgcolor: palette.navy,
  },
  "&::after": {
    width: '80%',
    left: '10%',
    backgroundColor: palette.orange,
  }
};

const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <GroupsIcon />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <MessageIcon />,
  },
];

const Sidebar = ({ w = "100%" }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(adminLogout());
  };

  return (
    <SidebarContainer width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
      <LogoText variant="h5">
        Kiksy
      </LogoText>

      <Stack spacing={"1rem"}>
        {adminTabs.map((tab, index) => (
          <Link
            key={tab.path}
            to={tab.path}
            sx={{
              animation: `${slideIn} 0.3s ease-out forwards`,
              animationDelay: `${index * 0.1}s`,
              opacity: 0,
              ...(location.pathname === tab.path && activeTabStyle)
            }}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
              <AnimatedIcon>{tab.icon}</AnimatedIcon>
              <Typography fontWeight={location.pathname === tab.path ? 'bold' : 'normal'}>
                {tab.name}
              </Typography>
            </Stack>
          </Link>
        ))}

        <Link 
          onClick={logoutHandler}
          sx={{
            animation: `${slideIn} 0.3s ease-out forwards`,
            animationDelay: `${adminTabs.length * 0.1}s`,
            opacity: 0,
            '&:hover': {
              color: palette.maroon,
              backgroundColor: alpha(palette.cream, 0.5),
            },
          }}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <AnimatedIcon sx={{ color: palette.maroon }}>
              <ExitToAppIcon />
            </AnimatedIcon>
            <Typography>Logout</Typography>
          </Stack>
        </Link>
      </Stack>
    </SidebarContainer>
  );
};

const MenuIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(palette.cream, 0.8),
  color: palette.navy,
  boxShadow: `0 2px 10px ${alpha(palette.navy, 0.2)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: palette.cream,
    transform: 'rotate(10deg)',
  }
}));

const AdminLayout = ({ children }) => {
  const { isAdmin } = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(false);

  const handleMobile = () => setIsMobile(!isMobile);
  const handleClose = () => setIsMobile(false);

  if (!isAdmin) return <Navigate to="/admin" />;

  return (
    <Grid container minHeight={"100vh"}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
          zIndex: 1300,
          animation: `${fadeIn} 0.5s ease`,
        }}
      >
        <MenuIconButton onClick={handleMobile}>
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </MenuIconButton>
      </Box>

      <Grid item md={4} lg={3} sx={{ 
        display: { xs: "none", md: "block" },
        borderRight: `1px solid ${alpha(palette.navy, 0.1)}`,
      }}>
        <Sidebar />
      </Grid>

      <Grid
        item
        xs={12}
        md={8}
        lg={9}
        sx={{
          bgcolor: alpha(palette.cream, 0.2),
          animation: `${fadeIn} 0.5s ease`,
          padding: '1rem',
          transition: 'all 0.3s ease',
        }}
      >
        <Box sx={{ 
          animation: `${fadeIn} 0.8s ease`,
          backdropFilter: 'blur(8px)',
          borderRadius: '1rem',
          height: '100%',
          overflow: 'auto',
        }}>
          {children}
        </Box>
      </Grid>

      <Drawer 
        open={isMobile} 
        onClose={handleClose}
        sx={{
          '& .MuiDrawer-paper': {
            borderTopRightRadius: '20px',
            borderBottomRightRadius: '20px',
            boxShadow: `0 0 20px ${alpha(palette.navy, 0.3)}`,
          }
        }}
      >
        <Sidebar w="70vw" />
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;