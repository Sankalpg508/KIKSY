import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
  Zoom,
  Fade,
  Paper,
  CircularProgress
} from "@mui/material";
import React, { useState } from "react";
import UserItem from "../shared/UserItem";
import {
  useAddGroupMembersMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/reducers/misc";
import { motion } from "framer-motion";
import { palette } from "../../constants/color";

const AddMemberDialog = ({ chatId }) => {
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);
  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);
  const [addMembers, isLoadingAddMembers] = useAsyncMutation(
    useAddGroupMembersMutation
  );
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };

  const addMemberSubmitHandler = () => {
    addMembers("Adding Members...", { members: selectedMembers, chatId });
    closeHandler();
  };

  useErrors([{ isError, error }]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20, x: -10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <Dialog 
      open={isAddMember} 
      onClose={closeHandler}
      TransitionComponent={Zoom}
      PaperComponent={({ children, ...props }) => (
        <Paper
          {...props}
          sx={{
            backgroundColor: palette.navy,
            borderRadius: "12px",
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.2)`,
            overflow: "hidden",
            border: `1px solid ${palette.blue}`,
          }}
        >
          {children}
        </Paper>
      )}
    >
      <Stack 
        p="2.5rem" 
        width={{ xs: "18rem", sm: "22rem" }} 
        spacing="2.5rem"
        sx={{
          color: palette.cream,
        }}
      >
        <DialogTitle 
          textAlign="center"
          sx={{
            color: palette.orange,
            fontWeight: 600,
            p: 0,
            fontSize: "1.5rem",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "60px",
              height: "3px",
              backgroundColor: palette.blue,
              borderRadius: "2px"
            }
          }}
        >
          Add Members
        </DialogTitle>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Stack spacing="1rem" maxHeight="300px" overflow="auto" sx={{
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: palette.navy,
            },
            "&::-webkit-scrollbar-thumb": {
              background: palette.blue,
              borderRadius: "6px",
            },
          }}>
            {isLoading ? (
              Array(3).fill(0).map((_, index) => (
                <Skeleton 
                  key={index} 
                  variant="rectangular" 
                  height={60} 
                  sx={{ 
                    backgroundColor: `${palette.blue}22`,
                    borderRadius: "8px" 
                  }} 
                />
              ))
            ) : data?.friends?.length > 0 ? (
              data?.friends?.map((i, index) => (
                <motion.div
                  key={i._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <UserItem
                    user={i}
                    handler={selectMemberHandler}
                    isAdded={selectedMembers.includes(i._id)}
                    customStyles={{
                      backgroundColor: selectedMembers.includes(i._id) 
                        ? `${palette.blue}50` 
                        : "transparent",
                      borderRadius: "8px",
                      padding: "0.5rem",
                      border: `1px solid ${selectedMembers.includes(i._id) ? palette.blue : "transparent"}`,
                      transition: "all 0.3s ease"
                    }}
                  />
                </motion.div>
              ))
            ) : (
              <Fade in timeout={500}>
                <Typography 
                  textAlign="center" 
                  variant="body1" 
                  sx={{ 
                    color: palette.cream,
                    py: 2,
                    fontStyle: "italic"
                  }}
                >
                  No friends available to add
                </Typography>
              </Fade>
            )}
          </Stack>
        </motion.div>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-evenly"
          spacing={2}
        >
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button 
              onClick={closeHandler}
              sx={{
                color: palette.cream,
                borderRadius: "8px",
                minWidth: "100px",
                fontWeight: 600,
                border: `1px solid ${palette.cream}`,
                "&:hover": {
                  backgroundColor: `${palette.cream}22`
                }
              }}
            >
              Cancel
            </Button>
          </motion.div>
          
          <motion.div
            variants={buttonVariants}
            whileHover={!isLoadingAddMembers ? "hover" : {}}
            whileTap={!isLoadingAddMembers ? "tap" : {}}
          >
            <Button
              onClick={addMemberSubmitHandler}
              variant="contained"
              disabled={isLoadingAddMembers || selectedMembers.length === 0}
              sx={{
                backgroundColor: palette.orange,
                color: palette.navy,
                fontWeight: 600,
                minWidth: "140px",
                borderRadius: "8px",
                position: "relative",
                "&:hover": {
                  backgroundColor: palette.maroon,
                  color: palette.cream
                },
                "&.Mui-disabled": {
                  backgroundColor: `${palette.orange}44`,
                  color: `${palette.cream}88`
                }
              }}
            >
              {isLoadingAddMembers ? (
                <React.Fragment>
                  <CircularProgress 
                    size={20} 
                    thickness={5} 
                    sx={{ 
                      color: palette.cream,
                      mr: 1 
                    }} 
                  />
                  Adding...
                </React.Fragment>
              ) : (
                selectedMembers.length > 0 ? 
                  `Add ${selectedMembers.length} ${selectedMembers.length === 1 ? 'Member' : 'Members'}` : 
                  'Add Members'
              )}
            </Button>
          </motion.div>
        </Stack>

        {selectedMembers.length > 0 && (
          <Fade in timeout={400}>
            <Typography 
              variant="caption" 
              textAlign="center"
              sx={{ 
                color: palette.cream,
                fontStyle: "italic",
                mt: -2
              }}
            >
              {selectedMembers.length} {selectedMembers.length === 1 ? 'member' : 'members'} selected
            </Typography>
          </Fade>
        )}
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;