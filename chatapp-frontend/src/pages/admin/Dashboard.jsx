import { useFetchData } from "6pp";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
  Fade,
  Zoom,
} from "@mui/material";
import moment from "moment";
import React, { useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { DoughnutChart, LineChart } from "../../components/specific/Charts";
import {
  CurveButton,
  SearchField,
} from "../../components/styles/StyledComponents";
import { matBlack, palette } from "../../constants/color";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/stats`,
    "dashboard-stats"
  );

  const { stats } = data || {};

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  const slideInVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const Appbar = (
    <Fade in timeout={800}>
      <Paper
        elevation={3}
        sx={{
          padding: "2rem",
          margin: "2rem 0",
          borderRadius: "1rem",
          background: `linear-gradient(145deg, ${palette.cream}, #fff)`,
          borderLeft: `4px solid ${palette.blue}`,
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
          },
        }}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
          <AdminPanelSettingsIcon
            sx={{ fontSize: "3rem", color: palette.navy }}
          />

          <SearchField placeholder="Search..." />

          <CurveButton
            sx={{
              background: palette.blue,
              "&:hover": {
                background: palette.navy,
              },
              transition: "background 0.3s ease",
            }}
          >
            Search
          </CurveButton>
          <Box flexGrow={1} />
          <Typography
            display={{
              xs: "none",
              lg: "block",
            }}
            color={palette.navy}
            textAlign={"center"}
            fontWeight="medium"
          >
            {moment().format("dddd, D MMMM YYYY")}
          </Typography>

          <NotificationsIcon
            sx={{
              color: palette.maroon,
              cursor: "pointer",
              transition: "transform 0.2s ease",
              "&:hover": {
                transform: "scale(1.2)",
              },
            }}
          />
        </Stack>
      </Paper>
    </Fade>
  );

  const Widgets = (
    <Stack
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
      direction={{
        xs: "column",
        sm: "row",
      }}
      spacing="2rem"
      justifyContent="space-between"
      alignItems={"center"}
      margin={"2rem 0"}
    >
      <Widget
        title={"Users"}
        value={stats?.usersCount}
        Icon={<PersonIcon />}
        color={palette.blue}
      />
      <Widget
        title={"Chats"}
        value={stats?.totalChatsCount}
        Icon={<GroupIcon />}
        color={palette.orange}
      />
      <Widget
        title={"Messages"}
        value={stats?.messagesCount}
        Icon={<MessageIcon />}
        color={palette.maroon}
      />
    </Stack>
  );

  const chartAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton 
          height={"100vh"} 
          sx={{ 
            background: `linear-gradient(90deg, ${palette.cream}22 25%, ${palette.cream}44 50%, ${palette.cream}22 75%)`,
            backgroundSize: "200% 100%",
            animation: "pulse 1.5s ease-in-out infinite",
            "@keyframes pulse": {
              "0%": { backgroundPosition: "0% 0%" },
              "100%": { backgroundPosition: "-200% 0%" },
            }
          }}
        />
      ) : (
        <Container component={"main"}>
          {Appbar}

          <Stack
            direction={{
              xs: "column",
              lg: "row",
            }}
            flexWrap={"wrap"}
            justifyContent={"center"}
            alignItems={{
              xs: "center",
              lg: "stretch",
            }}
            sx={{ gap: "2rem" }}
          >
            <motion.div
              variants={chartAnimation}
              initial="hidden"
              animate="visible"
              style={{ width: "100%", maxWidth: "45rem" }}
            >
              <Paper
                elevation={3}
                sx={{
                  padding: "2rem 3.5rem",
                  borderRadius: "1rem",
                  width: "100%",
                  background: `linear-gradient(145deg, #fff, ${palette.cream}33)`,
                  borderLeft: `4px solid ${palette.blue}`,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Typography 
                  margin={"2rem 0"} 
                  variant="h4" 
                  color={palette.navy}
                  fontWeight="500"
                >
                  Last Messages
                </Typography>

                <LineChart 
                  value={stats?.messagesChart || []} 
                  colors={{
                    borderColor: palette.blue,
                    backgroundColor: `${palette.blue}33`,
                  }}
                />
              </Paper>
            </motion.div>

            <motion.div
              variants={chartAnimation}
              initial="hidden"
              animate="visible"
              style={{ width: { xs: "100%", sm: "50%" }, maxWidth: "25rem" }}
            >
              <Paper
                elevation={3}
                sx={{
                  padding: "1rem",
                  borderRadius: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  position: "relative",
                  background: `linear-gradient(145deg, #fff, ${palette.cream}33)`,
                  borderLeft: `4px solid ${palette.orange}`,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <DoughnutChart
                  labels={["Single Chats", "Group Chats"]}
                  value={[
                    stats?.totalChatsCount - stats?.groupsCount || 0,
                    stats?.groupsCount || 0,
                  ]}
                  colors={[palette.blue, palette.orange]}
                />

                <Stack
                  position={"absolute"}
                  direction={"row"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  spacing={"0.5rem"}
                  width={"100%"}
                  height={"100%"}
                >
                  <GroupIcon sx={{ color: palette.orange }} /> 
                  <Typography color={palette.navy}>Vs</Typography>
                  <PersonIcon sx={{ color: palette.blue }} />
                </Stack>
              </Paper>
            </motion.div>
          </Stack>

          {Widgets}
        </Container>
      )}
    </AdminLayout>
  );
};

const Widget = ({ title, value, Icon, color }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    style={{ width: "20rem" }}
  >
    <Paper
      elevation={3}
      sx={{
        padding: "2rem",
        margin: "2rem 0",
        borderRadius: "1.5rem",
        width: "100%",
        background: `linear-gradient(145deg, #fff, ${palette.cream}33)`,
        borderLeft: `4px solid ${color}`,
        transition: "all 0.3s ease",
      }}
    >
      <Stack alignItems={"center"} spacing={"1rem"}>
        <Typography
          sx={{
            color: color,
            borderRadius: "50%",
            border: `5px solid ${color}`,
            width: "5rem",
            height: "5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "1.5rem",
            transition: "all 0.3s ease",
            background: `${color}11`,
            boxShadow: `0 4px 20px ${color}33`,
          }}
        >
          {value}
        </Typography>
        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
          <Box sx={{ color: color }}>{Icon}</Box>
          <Typography color={palette.navy} fontWeight="medium">{title}</Typography>
        </Stack>
      </Stack>
    </Paper>
  </motion.div>
);

export default Dashboard;