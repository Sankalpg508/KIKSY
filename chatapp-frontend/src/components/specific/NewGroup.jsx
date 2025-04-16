import { useInputValidation } from "6pp";
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
  Grow,
  Fade,
} from "@mui/material";
import React, { useState } from "react";
import { motion } from "framer-motion";
import UserItem from "../shared/UserItem";
import { useDispatch, useSelector } from "react-redux";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";
import { palette } from "../../constants/color";

const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation("");

  const [selectedMembers, setSelectedMembers] = useState([]);

  const errors = [
    {
      isError,
      error,
    },
  ];

  useErrors(errors);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please Select Atleast 3 Members");

    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  return (
    <Dialog 
      onClose={closeHandler} 
      open={isNewGroup}
      TransitionComponent={Grow}
      transitionDuration={400}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          backgroundColor: palette.cream,
          overflow: "hidden"
        }
      }}
    >
      <Stack 
        p={{ xs: "1.5rem", sm: "3rem" }} 
        width={"25rem"} 
        spacing={"2rem"}
        sx={{
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "6px",
            background: `linear-gradient(to right, ${palette.blue}, ${palette.orange})`,
          }
        }}
      >
        <Fade in={isNewGroup} timeout={600}>
          <DialogTitle 
            textAlign={"center"} 
            sx={{ 
              color: palette.navy,
              fontWeight: 600,
              fontSize: { xs: "1.5rem", sm: "2rem" },
              mt: 1
            }}
          >
            New Group
          </DialogTitle>
        </Fade>

        <Fade in={isNewGroup} timeout={800}>
          <TextField
            label="Group Name"
            value={groupName.value}
            onChange={groupName.changeHandler}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: palette.blue,
                },
                "&:hover fieldset": {
                  borderColor: palette.orange,
                },
                "&.Mui-focused fieldset": {
                  borderColor: palette.maroon,
                },
              },
              "& .MuiInputLabel-root": {
                color: palette.navy,
                "&.Mui-focused": {
                  color: palette.maroon,
                },
              },
            }}
          />
        </Fade>

        <Fade in={isNewGroup} timeout={1000}>
          <Typography 
            variant="body1"
            sx={{ 
              color: palette.navy,
              fontWeight: 500,
              borderBottom: `2px solid ${palette.blue}`,
              pb: 0.5,
              mb: 1
            }}
          >
            Members
          </Typography>
        </Fade>

        <Stack
          sx={{
            maxHeight: "300px",
            overflow: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: `${palette.blue} transparent`,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: palette.blue,
              borderRadius: "20px",
            }
          }}
        >
          {isLoading ? (
            <Stack spacing={1}>
              {[1, 2, 3].map((item) => (
                <Skeleton 
                  key={item} 
                  variant="rectangular" 
                  height={60} 
                  sx={{ borderRadius: "8px" }} 
                />
              ))}
            </Stack>
          ) : (
            data?.friends?.map((i, index) => (
              <motion.div
                key={i._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <UserItem
                  user={i}
                  handler={selectMemberHandler}
                  isAdded={selectedMembers.includes(i._id)}
                  styling={{
                    bgcolor: selectedMembers.includes(i._id) ? `${palette.blue}15` : "transparent",
                    borderRadius: "8px",
                    transition: "all 0.3s ease"
                  }}
                />
              </motion.div>
            ))
          )}
        </Stack>

        <Stack 
          direction={"row"} 
          justifyContent={"space-evenly"}
          spacing={2}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outlined"
              size="large"
              onClick={closeHandler}
              sx={{
                color: palette.maroon,
                borderColor: palette.maroon,
                "&:hover": {
                  borderColor: palette.maroon,
                  backgroundColor: `${palette.maroon}15`,
                },
                px: 3
              }}
            >
              Cancel
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={submitHandler}
              disabled={isLoadingNewGroup}
              sx={{
                bgcolor: palette.blue,
                color: palette.cream,
                "&:hover": {
                  bgcolor: palette.navy,
                },
                "&.Mui-disabled": {
                  bgcolor: `${palette.blue}80`,
                },
                px: 3
              }}
            >
              Create
            </Button>
          </motion.div>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;