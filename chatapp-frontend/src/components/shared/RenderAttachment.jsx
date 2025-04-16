import React, { useState } from "react";
import { transformImage } from "../../lib/features";
import { 
  FileOpen as FileOpenIcon,
  Audiotrack as AudiotrackIcon,
  VideoFile as VideoFileIcon,
  Image as ImageIcon
} from "@mui/icons-material";
import { Box, CircularProgress, Fade, alpha } from "@mui/material";
import { palette } from "../../constants/color";

const RenderAttachment = (file, url) => {
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);

  // Shared styling for attachment container
  const containerStyle = {
    position: "relative",
    borderRadius: "8px",
    overflow: "hidden",
    transition: "all 0.3s ease",
    transform: hovered ? "scale(1.02)" : "scale(1)",
    boxShadow: hovered ? 
      `0 8px 20px ${alpha(palette.navy, 0.25)}` : 
      `0 4px 12px ${alpha(palette.navy, 0.15)}`,
  };

  // Loading spinner
  const LoadingSpinner = () => (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: loading ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: alpha(palette.cream, 0.6),
        zIndex: 2,
      }}
    >
      <CircularProgress size={30} sx={{ color: palette.blue }} />
    </Box>
  );

  // File icon with animation
  const FileIcon = ({ Icon, color }) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        backgroundColor: alpha(palette.cream, 0.7),
        borderRadius: "8px",
        border: `1px solid ${alpha(color, 0.2)}`,
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: alpha(color, 0.1),
          transform: "translateY(-3px)",
        },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Fade in={true} timeout={500}>
        <Box
          sx={{
            animation: "pulse 2s infinite ease-in-out",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.1)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        >
          <Icon sx={{ fontSize: 50, color: color }} />
        </Box>
      </Fade>
    </Box>
  );

  switch (file) {
    case "video":
      return (
        <Box 
          sx={containerStyle}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <LoadingSpinner />
          <Box
            sx={{
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: hovered ? `linear-gradient(to bottom, ${alpha(palette.maroon, 0.2)}, transparent)` : 'none',
                zIndex: 1,
                transition: 'all 0.3s ease',
              }
            }}
          >
            <video 
              src={url} 
              preload="metadata" 
              width={"200px"} 
              controls 
              onLoadedData={() => setLoading(false)}
              style={{
                borderRadius: "8px",
                border: `1px solid ${alpha(palette.maroon, 0.3)}`,
              }}
            />
          </Box>
        </Box>
      );

    case "image":
      return (
        <Box 
          sx={containerStyle}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <LoadingSpinner />
          <Box
            sx={{
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: hovered ? `linear-gradient(to bottom, ${alpha(palette.blue, 0.2)}, transparent)` : 'none',
                zIndex: 1,
                transition: 'all 0.3s ease',
                borderRadius: "8px",
              }
            }}
          >
            <img
              src={transformImage(url, 200)}
              alt="Attachment"
              width={"200px"}
              height={"150px"}
              onLoad={() => setLoading(false)}
              style={{
                objectFit: "contain",
                borderRadius: "8px",
                border: `1px solid ${alpha(palette.blue, 0.3)}`,
              }}
            />
          </Box>
        </Box>
      );

    case "audio":
      return (
        <Box 
          sx={{
            ...containerStyle,
            padding: "0.5rem",
            backgroundColor: alpha(palette.orange, 0.05),
            border: `1px solid ${alpha(palette.orange, 0.2)}`,
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <LoadingSpinner />
          <audio 
            src={url} 
            preload="metadata" 
            controls 
            onLoadedData={() => setLoading(false)}
            style={{
              width: "200px",
              borderRadius: "8px",
            }}
          />
        </Box>
      );

    default:
      return <FileIcon Icon={FileOpenIcon} color={palette.navy} />;
  }
};

export default RenderAttachment;