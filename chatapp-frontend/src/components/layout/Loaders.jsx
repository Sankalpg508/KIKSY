import { Grid, Skeleton, Stack, keyframes, styled, useTheme, alpha } from "@mui/material";
import React from "react";

// Use the color palette from previous component
const palette = {
  'navy': '#001524',
  'blue': '#15616D',
  'cream': '#FFECD1',
  'orange': '#FF7D00',
  'maroon': '#78290F',
};

// Animation keyframes
const pulse = keyframes`
  0% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
`;

const wave = keyframes`
  0% {
    background-position: -500px 0;
  }
  100% {
    background-position: 500px 0;
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
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

// Enhanced styled components
const AnimatedSkeleton = styled(Skeleton)(({ theme }) => ({
  background: `linear-gradient(90deg, ${alpha(palette.cream, 0.3)} 25%, ${alpha(palette.blue, 0.2)} 50%, ${alpha(palette.cream, 0.3)} 75%)`,
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite linear`,
  borderRadius: '8px',
  '&.MuiSkeleton-rectangular': {
    borderRadius: '12px',
  },
  '&.MuiSkeleton-rounded': {
    borderRadius: '8px',
  },
  '&.MuiSkeleton-circular': {
    borderRadius: '50%',
  },
}));

const SidebarSkeleton = styled(AnimatedSkeleton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(palette.navy, 0.2)} 0%, ${alpha(palette.blue, 0.15)} 50%, ${alpha(palette.navy, 0.2)} 100%)`,
  backgroundSize: '200% 100%',
  animation: `${shimmer} 2s infinite ease-in-out`,
  border: `1px solid ${alpha(palette.navy, 0.1)}`,
  boxShadow: `0 4px 20px ${alpha(palette.navy, 0.1)}`,
}));

const ProfileSkeleton = styled(AnimatedSkeleton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(palette.maroon, 0.2)} 0%, ${alpha(palette.orange, 0.1)} 50%, ${alpha(palette.maroon, 0.2)} 100%)`,
  backgroundSize: '200% 100%',
  animation: `${shimmer} 2s infinite ease-in-out`,
  border: `1px solid ${alpha(palette.maroon, 0.1)}`,
  boxShadow: `0 4px 20px ${alpha(palette.maroon, 0.1)}`,
}));

const ChatItemSkeleton = styled(AnimatedSkeleton)(({ theme, index }) => ({
  background: `linear-gradient(90deg, ${alpha(palette.blue, 0.2)} 25%, ${alpha(palette.cream, 0.3)} 50%, ${alpha(palette.blue, 0.2)} 75%)`,
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.8s infinite linear`,
  animationDelay: `${index * 0.1}s`,
  boxShadow: `0 2px 8px ${alpha(palette.navy, 0.1)}`,
  border: `1px solid ${alpha(palette.blue, 0.1)}`,
  transform: 'translateX(0)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateX(5px)',
  }
}));

const BouncingSkeleton = styled(Skeleton)(({ theme, delay }) => ({
  backgroundColor: palette.orange,
  animation: `${bounce} 1s infinite ease-in-out`,
  animationDelay: delay || '0s',
  boxShadow: `0 2px 8px ${alpha(palette.orange, 0.3)}`,
}));

const Container = styled(Grid)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(palette.cream, 0.05)} 0%, ${alpha(palette.cream, 0.1)} 100%)`,
  padding: '1rem',
  overflow: 'hidden',
}));

const ChatStack = styled(Stack)(({ theme }) => ({
  animation: `${pulse} 2s infinite ease-in-out`,
  padding: '1rem',
  background: alpha(palette.cream, 0.05),
  borderRadius: '12px',
}));

const LayoutLoader = () => {
  return (
    <Container container height="calc(100vh - 4rem)" spacing="1rem">
      {/* Sidebar */}
      <Grid
        item
        sm={4}
        md={3}
        sx={{
          display: { xs: "none", sm: "block" },
        }}
        height="100%"
      >
        <SidebarSkeleton variant="rectangular" height="100vh" />
      </Grid>

      {/* Chat Area */}
      <Grid item xs={12} sm={8} md={5} lg={6} height="100%">
        <ChatStack spacing="1rem">
          {Array.from({ length: 10 }).map((_, index) => (
            <ChatItemSkeleton 
              key={index} 
              variant="rounded" 
              height="5rem" 
              index={index}
            />
          ))}
        </ChatStack>
      </Grid>

      {/* Profile Area */}
      <Grid
        item
        md={4}
        lg={3}
        height="100%"
        sx={{
          display: { xs: "none", md: "block" },
        }}
      >
        <ProfileSkeleton variant="rectangular" height="100vh" />
      </Grid>
    </Container>
  );
};

const TypingContainer = styled(Stack)(({ theme }) => ({
  padding: '0.75rem',
  justifyContent: 'center',
  background: `linear-gradient(90deg, ${alpha(palette.cream, 0.1)} 0%, ${alpha(palette.cream, 0.2)} 50%, ${alpha(palette.cream, 0.1)} 100%)`,
  borderRadius: '2rem',
  boxShadow: `0 2px 10px ${alpha(palette.navy, 0.1)}`,
  maxWidth: 'fit-content',
  margin: '0 auto',
}));

const TypingLoader = () => {
  return (
    <TypingContainer
      spacing="0.5rem"
      direction="row"
      alignItems="center"
    >
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        delay="0s"
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        delay="0.2s"
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        delay="0.4s"
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        delay="0.6s"
      />
    </TypingContainer>
  );
};

export { TypingLoader, LayoutLoader };