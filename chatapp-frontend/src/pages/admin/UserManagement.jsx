// pages/admin/UserManagement.jsx
import { useFetchData } from "6pp";
import { Avatar, Skeleton, Box, Typography, Fade, Chip } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import SearchBar from "../../components/shared/SearchBar";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";
import { palette, themeColors } from "../../constants/color";
import { motion } from "framer-motion";

const MotionAvatar = motion(Avatar);

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
      <MotionAvatar 
        alt={params.row.name} 
        src={params.row.avatar}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.15, boxShadow: themeColors.shadows.medium }}
        sx={{ 
          border: `2px solid ${themeColors.primary}`,
          width: 40,
          height: 40
        }}
      />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Typography 
        sx={{ 
          color: themeColors.text, 
          fontWeight: 500,
          transition: 'color 0.3s ease',
          '&:hover': { color: themeColors.primary }
        }}
      >
        {params.row.name}
      </Typography>
    )
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Typography 
        sx={{ 
          color: themeColors.text, 
          fontStyle: 'italic',
          fontSize: '0.9rem'
        }}
      >
        @{params.row.username}
      </Typography>
    )
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <Chip 
        label={params.row.friends}
        sx={{
          backgroundColor: themeColors.primary,
          color: 'white',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: palette.navy,
            transform: 'scale(1.05)',
            transition: 'transform 0.3s ease, background-color 0.3s ease'
          }
        }}
      />
    )
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Chip 
        label={params.row.groups}
        sx={{
          backgroundColor: palette.orange,
          color: 'white',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: palette.maroon,
            transform: 'scale(1.05)',
            transition: 'transform 0.3s ease, background-color 0.3s ease'
          }
        }}
      />
    )
  },
];

const UserManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/users`,
    "dashboard-users"
  );

  useErrors([{ isError: error, error: error }]);
  const [rows, setRows] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (data) {
      const formattedUsers = data.users.map((i) => ({
        ...i,
        id: i._id,
        avatar: transformImage(i.avatar, 50),
      }));
      
      setAllUsers(formattedUsers);
      setRows(formattedUsers);
    }
  }, [data]);

  const handleSearch = (query) => {
    if (!query) {
      setRows(allUsers);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.username.toLowerCase().includes(lowercaseQuery) ||
        user.id.toLowerCase().includes(lowercaseQuery)
    );
    
    setRows(filtered);
  };

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
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
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Box sx={{ padding: "20px 20px 0 20px" }}>
            <SearchBar 
              placeholder="Search users by name, username or ID..." 
              onSearch={handleSearch} 
            />
          </Box>
          <Table 
            heading={"All Users"} 
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
        </motion.div>
      )}
    </AdminLayout>
  );
};

export default UserManagement;