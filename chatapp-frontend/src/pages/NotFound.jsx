import React, { useEffect, useState } from "react";
import { Error as ErrorIcon } from "@mui/icons-material";
import { Container, Stack, Typography, Button, Box, keyframes } from "@mui/material";
import { Link } from "react-router-dom";
import { palette } from "../constants/";

const NotFound = () => {
  const [mounted, setMounted] = useState(false);

  // Animation keyframes
  const fadeIn = keyframes`
    0% { opacity: 0; transform: translateY(-20px); }
    100% { opacity: 1; transform: translateY(0); }
  `;

  const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  `;

  const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
  `;

  const rotate = keyframes`
    0% { transform: rotate(0deg); }
    25% { transform: rotate(3deg); }
    75% { transform: rotate(-3deg); }
    100% { transform: rotate(0deg); }
  `;

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        height: "100vh",
        background: `linear-gradient(135deg, ${palette.cream} 0%, ${palette.cream} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background elements */}
      <Box 
        sx={{
          position: 'absolute',
          top: '5%',
          right: '10%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: alpha(palette.orange, 0.1),
          animation: `${float} 6s ease-in-out infinite`,
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '15%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: alpha(palette.blue, 0.1),
          animation: `${float} 8s ease-in-out infinite 1s`,
        }}
      />
      
      <Stack
        alignItems="center"
        spacing="2rem"
        justifyContent="center"
        height="100%"
        sx={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            animation: `${float} 4s ease-in-out infinite, ${rotate} 6s ease-in-out infinite`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1.5rem',
            borderRadius: '50%',
            background: alpha(palette.navy, 0.05),
            boxShadow: `0 10px 30px ${alpha(palette.navy, 0.1)}`,
            transition: 'all 0.3s ease',
          }}
        >
          <ErrorIcon 
            sx={{ 
              fontSize: "10rem",
              color: palette.maroon,
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
            }} 
          />
        </Box>
        
        <Typography 
          variant="h1" 
          sx={{ 
            color: palette.navy,
            fontWeight: 'bold',
            animation: mounted ? `${fadeIn} 0.8s ease forwards` : 'none',
            opacity: 0,
            textShadow: `2px 2px 4px ${alpha(palette.navy, 0.2)}`,
            fontSize: { xs: '5rem', md: '7rem' },
          }}
        >
          404
        </Typography>
        
        <Typography 
          variant="h3" 
          sx={{ 
            color: palette.blue,
            animation: mounted ? `${fadeIn} 0.8s ease forwards 0.3s` : 'none',
            opacity: 0,
            fontWeight: 500,
            fontSize: { xs: '1.5rem', md: '2.5rem' }
          }}
        >
          Page Not Found
        </Typography>
        
        <Button
          component={Link}
          to="/"
          variant="contained"
          sx={{
            backgroundColor: palette.orange,
            color: 'white',
            padding: '0.8rem 2rem',
            borderRadius: '50px',
            fontSize: '1.1rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: `0 4px 14px ${alpha(palette.orange, 0.5)}`,
            animation: mounted ? `${fadeIn} 0.8s ease forwards 0.6s, ${pulse} 2s infinite 1.5s` : 'none',
            opacity: 0,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: palette.maroon,
              transform: 'translateY(-3px)',
              boxShadow: `0 6px 18px ${alpha(palette.maroon, 0.6)}`,
            }
          }}
        >
          Return to Home
        </Button>
      </Stack>
    </Container>
  );
};

export default NotFound;