import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Zoom,
  Box,
  alpha
} from "@mui/material";
import React from "react";
import { palette } from "../constants/color";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

const ConfirmDeleteDialog = ({ open, handleClose, deleteHandler }) => {
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          backgroundColor: palette.cream,
          borderRadius: '10px',
          borderLeft: `4px solid ${palette.maroon}`,
          boxShadow: `0 4px 20px ${alpha(palette.navy, 0.25)}`,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${palette.orange}, ${palette.maroon})`,
          }
        }
      }}
    >
      <DialogTitle sx={{ 
        color: palette.navy,
        fontWeight: 'bold',
        pb: 1
      }}>
        Confirm Delete
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: palette.blue }}>
          Are you sure you want to delete this group?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pb: 2, px: 3 }}>
        <Button 
          onClick={handleClose}
          sx={{
            color: palette.blue,
            '&:hover': {
              backgroundColor: alpha(palette.blue, 0.1),
              transform: 'translateY(-2px)',
              transition: 'all 0.2s'
            },
            transition: 'all 0.2s'
          }}
        >
          No
        </Button>
        <Button 
          onClick={deleteHandler} 
          variant="contained"
          sx={{
            backgroundColor: palette.maroon,
            '&:hover': {
              backgroundColor: alpha(palette.maroon, 0.9),
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 8px ${alpha(palette.maroon, 0.4)}`,
              transition: 'all 0.2s'
            },
            transition: 'all 0.2s'
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;