import { Avatar, AvatarGroup, Box, Stack } from "@mui/material";
import React, { useState } from "react";
import { transformImage } from "../../lib/features";
import { palette } from "../../constants/color";
import { keyframes } from "@emotion/react";

// Animation keyframes
const popIn = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
`;

const hoverPulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 rgba(0,0,0,0); }
  50% { transform: scale(1.05); box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
  100% { transform: scale(1); box-shadow: 0 0 0 rgba(0,0,0,0); }
`;

const AvatarCard = ({ avatar = [], max = 4 }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <Stack direction={"row"} spacing={0.5}>
      <AvatarGroup
        max={max}
        sx={{
          position: "relative",
        }}
      >
        <Box width={"5rem"} height={"3rem"}>
          {avatar.map((i, index) => (
            <Avatar
              key={Math.random() * 100}
              src={transformImage(i)}
              alt={`Avatar ${index}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              sx={{
                width: "3rem",
                height: "3rem",
                position: "absolute",
                left: {
                  xs: `${0.5 + index}rem`,
                  sm: `${index}rem`,
                },
                animation: `${popIn} 0.5s ease-out forwards ${0.1 * index}s`,
                opacity: 0, // Start with opacity 0 for animation
                transform: "scale(0.8)", // Start smaller for animation
                transition: "all 0.3s ease",
                border: `2px solid ${palette.cream}`,
                boxShadow: hoveredIndex === index ? 
                  `0 4px 8px rgba(0,0,0,0.2), 0 0 0 2px ${palette.blue}` : 
                  '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: hoveredIndex === index ? 10 : 1 + index,
                '&:hover': {
                  transform: 'scale(1) translateY(-5px)',
                  zIndex: 10,
                  animation: `${hoverPulse} 1s ease infinite`,
                },
                // Different border colors based on index for visual variety
                '&:nth-of-type(4n+1)': { borderColor: palette.blue },
                '&:nth-of-type(4n+2)': { borderColor: palette.orange },
                '&:nth-of-type(4n+3)': { borderColor: palette.maroon },
                '&:nth-of-type(4n+4)': { borderColor: palette.navy },
              }}
            />
          ))}
        </Box>
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;