// pages/admin/MessageManagement.jsx
import { useFetchData } from "6pp";
import { Avatar, Box, Stack, Skeleton, Typography, Fade } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import RenderAttachment from "../../components/shared/RenderAttachment";
import Table from "../../components/shared/Table";
import SearchBar from "../../components/shared/SearchBar";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import { fileFormat, transformImage } from "../../lib/features";
import { palette, themeColors } from "../../constants/color";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const AttachmentContainer = ({ url, file }) => {
  return (
    <MotionBox
      component="a"
      href={url}
      download
      target="_blank"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      sx={{
        display: 'inline-block',
        backgroundColor: `${themeColors.background}80`,
        padding: '8px',
        borderRadius: '4px',
        margin: '4px',
        boxShadow: themeColors.shadows.small,
        color: themeColors.text,
        textDecoration: 'none',
        '&:hover': {
          boxShadow: themeColors.shadows.medium,
          backgroundColor: themeColors.background
        }
      }}
    >
      {RenderAttachment(file, url)}
    </MotionBox>
  );
};

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      const { attachments } = params.row;

      return attachments?.length > 0
        ? attachments.map((i, index) => {
            const url = i.url;
            const file = fileFormat(url);

            return (
              <AttachmentContainer 
                key={index} 
                url={url} 
                file={file} 
              />
            );
          })
        : (
          <Typography 
            variant="body2" 
            sx={{ 
              color: themeColors.text,
              fontStyle: 'italic',
              opacity: 0.7
            }}
          >
            No Attachments
          </Typography>
        );
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <Typography 
        sx={{ 
          color: themeColors.text,
          maxHeight: '150px',
          overflow: 'auto',
          padding: '8px',
          borderRadius: '4px',
          backgroundColor: `${themeColors.background}30`,
          '&::-webkit-scrollbar': {
            width: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: themeColors.primary,
            borderRadius: '4px'
          }
        }}
      >
        {params.row.content}  
      </Typography>
    )
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <Avatar 
          alt={params.row.sender.name} 
          src={params.row.sender.avatar} 
          sx={{ 
            border: `2px solid ${themeColors.primary}`,
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: themeColors.shadows.small
            }
          }}
        />
        <Typography 
          sx={{ 
            color: themeColors.text, 
            fontWeight: 500,
            transition: 'color 0.3s ease',
            '&:hover': { color: themeColors.primary }
          }}
        >
          {params.row.sender.name}
        </Typography>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Typography sx={{ 
        color: themeColors.text, 
        fontSize: '0.875rem',
        fontFamily: 'monospace' 
      }}>
        {params.row.createdAt}
      </Typography>
    )
  },
];

const MessageManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/messages`,
    "dashboard-messages"
  );

  useErrors([{ isError: error, error: error }]);
  const [rows, setRows] = useState([]);
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    if (data) {
      const formattedMessages = data.messages.map((i) => ({
        ...i,
        id: i._id,
        sender: {
          name: i.sender.name,
          avatar: transformImage(i.sender.avatar, 50),
        },
        createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
      }));
      
      setAllMessages(formattedMessages);
      setRows(formattedMessages);
    }
  }, [data]);

  const handleSearch = (query) => {
    if (!query) {
      setRows(allMessages);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = allMessages.filter(
      (message) =>
        (message.content && message.content.toLowerCase().includes(lowercaseQuery)) ||
        message.sender.name.toLowerCase().includes(lowercaseQuery) ||
        message.chat.toLowerCase().includes(lowercaseQuery) ||
        message.id.toLowerCase().includes(lowercaseQuery) ||
        message.createdAt.toLowerCase().includes(lowercaseQuery)
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
                placeholder="Search messages by content, sender, chat or date..." 
                onSearch={handleSearch} 
              />
            </Box>
            <Table
              heading={"All Messages"}
              columns={columns}
              rows={rows}
              rowHeight={200}
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

export default MessageManagement;