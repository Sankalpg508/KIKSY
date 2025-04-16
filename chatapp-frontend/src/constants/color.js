export const orange = "#ea7070";
export const orangeLight = "rgba(234, 112, 112, 0.2)";

export const grayColor = "rgba(9, 23, 116, 0)";
export const lightBlue = "#2694ab";
export const matBlack = "#1c1c1c";
export const bgGradient = "linear-gradient(rgb(255, 225, 209), rgb(249, 159, 159))";

export const purple = "rgb(102, 61, 177)";
export const purpleLight = "rgba(179, 103, 151, 0.86)";

// constants/colors.js
export const palette = {
  navy: "#001524",
  blue: "#15616D",
  cream: "#FFECD1",
  creamDark: "#D1B68C", // Significantly darker version of cream
  orange: "#FF7D00",
  maroon: "#B8484A",
  charcoal_blue: "#1C2B35",
  Midnight_green: "#0A3B44",
  Dark_Chocolate: "#5A4A3F",
  Deep_Terracotta: "#9A3E25",
  Forest_Green: "#1F4438",
  Slate: "#2C3E50",
  Dark_Aubergine: "#3D2B3D",
  graphite: "#333333",

};

// Helper for creating color with opacity
export const withOpacity = (color, opacity) => {
  return `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
};

// Theme-specific colors for consistent usage
export const themeColors = {
  primary: palette.blue,
  secondary: palette.orange,
  background: palette.cream,
  text: palette.navy,
  accent: palette.maroon,
  
  // Gradients
  gradients: {
    primary: `linear-gradient(to right, ${palette.blue}, ${palette.navy})`,
    secondary: `linear-gradient(to right, ${palette.orange}, ${palette.maroon})`,
    light: `linear-gradient(145deg, #fff, ${palette.cream}33)`,
  },
  
  // Shadows
  shadows: {
    small: `0 2px 8px rgba(0,0,0,0.1)`,
    medium: `0 4px 12px rgba(0,0,0,0.15)`,
    large: `0 8px 24px rgba(0,0,0,0.2)`,
    primary: (opacity = 0.3) => `0 4px 12px ${withOpacity(palette.blue, opacity)}`,
    secondary: (opacity = 0.3) => `0 4px 12px ${withOpacity(palette.orange, opacity)}`,
  }
};

// Enhanced animations
export const animations = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  slideUp: `
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,
  pulse: `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
  `
};



