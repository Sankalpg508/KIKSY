// pages/admin/ChatManagement.jsx
import { useFetchData } from "6pp";
import { Avatar, Skeleton, Stack, Box, Typography, Fade } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import AvatarCard from "../../components/shared/AvatarCard";
import Table from "../../components/shared/Table";
import SearchBar from "../../components/shared/SearchBar";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";
import { palette, themeColors } from "../../constants/color";
import { motion } from "framer-motion";

// Custom styled components 
const StyledAvatar = ({ src, alt, ...props }) => (
  <Avatar 
    alt={alt} 
    src={src} 
    sx={{ 
      border: `2px solid ${themeColors.primary}`,
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'scale(1.1)',
        boxShadow: themeColors.shadows.small
      }
    }}
    {...props}
  />
);

const MotionBox = motion(Box);

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <MotionBox 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AvatarCard avatar={params.row.avatar} />
      </MotionBox>
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300,
  },
  {
    field: "groupChat",
    headerName: "Group",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <MotionBox 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <AvatarCard max={100} avatar={params.row.members} />
      </MotionBox>
    ),
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "creator",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Stack direction="row" alignItems="center" spacing={"1rem"}>
        <StyledAvatar alt={params.row.creator.name} src={params.row.creator.avatar} />
        <Typography 
          sx={{ 
            color: themeColors.text, 
            fontWeight: 500,
            transition: 'color 0.3s ease',
            '&:hover': { color: themeColors.primary }
          }}
        >
          {params.row.creator.name}
        </Typography>
      </Stack>
    ),
  },
];

const ChatManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/chats`,
    "dashboard-chats"
  );

  useErrors([{ isError: error, error: error }]);
  const [rows, setRows] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);

  useEffect(() => {
    if (data) {
      const formattedChats = data.chats.map((i) => ({
        ...i,
        id: i._id,
        avatar: i.avatar.map((i) => transformImage(i, 50)),
        members: i.members.map((i) => transformImage(i.avatar, 50)),
        creator: {
          name: i.creator.name,
          avatar: transformImage(i.creator.avatar, 50),
        },
      }));
      
      setAllChats(formattedChats);
      setFilteredChats(formattedChats);
      setRows(formattedChats);
    }
  }, [data]);

  const handleSearch = (query) => {
    if (!query) {
      setRows(allChats);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = allChats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(lowercaseQuery) ||
        chat.creator.name.toLowerCase().includes(lowercaseQuery) ||
        chat.id.toLowerCase().includes(lowercaseQuery)
    );
    
    setRows(filtered);
  };

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton 
          height={"100vh"} 
          variant="rectangular"
          sx={{
            backgroundColor: `${themeColors.background}40`,
            background: `linear-gradient(90deg, ${themeColors.background}40 25%, ${themeColors.background}60 50%, ${themeColors.background}40 75%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite linear',
            '@keyframes shimmer': {
              '0%': { backgroundPosition: '-200% 0' },
              '100%': { backgroundPosition: '200% 0' }
            }
          }}
        />
      ) : (
        <Fade in={!loading} timeout={800}>
          <div>
            <Box sx={{ padding: "20px 20px 0 20px" }}>
              <SearchBar 
                placeholder="Search chats by name, creator or ID..." 
                onSearch={handleSearch} 
              />
            </Box>
            <Table 
              heading={"All Chats"} 
              columns={columns} 
              rows={rows} 
              sx={{
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: themeColors.primary,
                  color: themeColors.background
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: `${themeColors.background}90`,
                  transition: 'background-color 0.3s ease'
                }
              }}
            />
          </div>
        </Fade>
      )}
    </AdminLayout>
  );
};

export default ChatManagement;