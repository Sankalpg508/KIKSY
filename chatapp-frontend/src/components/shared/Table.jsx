// components/shared/Table.jsx
import { Box, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { palette, themeColors } from "../../constants/color";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper);
const MotionTypography = motion(Typography);

const Table = ({
  columns = [],
  rows = [],
  rowHeight = 52,
  heading = "",
  sx = {},
}) => {
  return (
    <Box 
      sx={{ 
        padding: "20px" 
      }}
    >
      <MotionTypography
        variant="h4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          color: themeColors.text,
          fontWeight: 600,
          marginBottom: "20px",
          borderLeft: `4px solid ${themeColors.primary}`,
          paddingLeft: "10px"
        }}
      >
        {heading}
      </MotionTypography>

      <MotionPaper
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        sx={{ 
          width: "100%", 
          overflow: "hidden",
          boxShadow: themeColors.shadows.medium,
          border: `1px solid ${themeColors.background}`,
          borderRadius: "8px"
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          disableDensitySelector
          disableSelectionOnClick
          autoHeight
          rowHeight={rowHeight}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          sx={{
            border: "none",
            "& .table-header": {
              backgroundColor: themeColors.primary,
              color: "white",
              fontWeight: "bold"
            },
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
            },
            "& .MuiDataGrid-columnHeader:focus-within": {
              outline: "none !important",
            },
            ...sx
          }}
        />
      </MotionPaper>
    </Box>
  );
};

export default Table;