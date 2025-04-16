// components/shared/SearchBar.jsx
import React, { useState } from "react";
import { Box, InputAdornment, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { motion } from "framer-motion";
import { themeColors } from "../../constants/color";

const SearchBar = ({ placeholder = "Search...", onSearch, sx = {} }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 3, ...sx }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: themeColors.primary }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={clearSearch}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: "8px",
              backgroundColor: `${themeColors.background}50`,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: themeColors.background,
                boxShadow: themeColors.shadows.small,
              },
              "&.Mui-focused": {
                boxShadow: themeColors.shadows.primary(0.2),
              },
            },
          }}
        />
      </Box>
    </motion.div>
  );
};

export default SearchBar;