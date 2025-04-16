import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Fade,
  Grow,
} from "@mui/material";
import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LayoutLoader } from "../components/layout/Loaders";
import AvatarCard from "../components/shared/AvatarCard";
import { Link } from "../components/styles/StyledComponents";
import { palette } from "../constants/color";
import { useDispatch, useSelector } from "react-redux";
import UserItem from "../components/shared/UserItem";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { setIsAddMember } from "../redux/reducers/misc";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

// Create the gradient using the palette
const createGradient = () => `linear-gradient(135deg, ${palette.navy} 0%, ${palette.blue} 100%)`;

const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);

  const myGroups = useMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );

  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );

  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");

  const [members, setMembers] = useState([]);

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdatedValue,
    });
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  };

  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId });
  };

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);

  const IconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
      >
        <IconButton 
          onClick={handleMobile}
          sx={{
            color: palette.navy,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "rotate(90deg)",
              color: palette.blue
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      <Tooltip title="back">
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: palette.navy,
            color: palette.cream,
            transition: "all 0.3s ease",
            ":hover": {
              bgcolor: palette.blue,
              transform: "translateX(-5px)"
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const GroupName = (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"3rem"}
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: palette.blue,
                },
                "&:hover fieldset": {
                  borderColor: palette.orange,
                },
                "&.Mui-focused fieldset": {
                  borderColor: palette.orange,
                }
              },
            }}
          />
          <IconButton 
            onClick={updateGroupName} 
            disabled={isLoadingGroupName}
            sx={{
              bgcolor: palette.orange,
              color: palette.cream,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: palette.maroon,
              },
              "&.Mui-disabled": {
                bgcolor: `${palette.orange}50`,
              }
            }}
          >
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography 
            variant="h4" 
            sx={{ 
              color: palette.navy,
              fontWeight: "600",
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
            }}
          >
            {groupName}
          </Typography>
          <IconButton
            disabled={isLoadingGroupName}
            onClick={() => setIsEdit(true)}
            sx={{
              color: palette.blue,
              transition: "all 0.3s ease",
              "&:hover": {
                color: palette.orange,
                transform: "rotate(15deg)"
              },
            }}
          >
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );

  const ButtonGroup = (
    <Stack
      direction={{
        xs: "column-reverse",
        sm: "row",
      }}
      spacing={"1rem"}
      p={{
        xs: "0",
        sm: "1rem",
        md: "1rem 4rem",
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Button
        size="large"
        sx={{
          bgcolor: `${palette.maroon}10`,
          color: palette.maroon,
          borderRadius: "8px",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: palette.maroon,
            color: palette.cream,
          }
        }}
        startIcon={<DeleteIcon />}
        onClick={openConfirmDeleteHandler}
      >
        Delete Group
      </Button>
      <Button
        size="large"
        variant="contained"
        sx={{
          bgcolor: palette.blue,
          color: palette.cream,
          borderRadius: "8px",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: palette.navy,
          }
        }}
        startIcon={<AddIcon />}
        onClick={openAddMemberHandler}
      >
        Add Member
      </Button>
    </Stack>
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const memberVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return myGroups.isLoading ? (
    <LayoutLoader />
  ) : (
    <Grid container height={"100vh"}>
      <Grid
        item
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
        }}
        sm={4}
      >
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>

      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 3rem",
          bgcolor: palette.cream,
        }}
      >
        {IconBtns}

        {groupName && (
          <>
            {GroupName}

            <Typography
              margin={"2rem"}
              alignSelf={"flex-start"}
              variant="body1"
              sx={{ 
                color: palette.navy,
                fontWeight: "600",
                borderBottom: `2px solid ${palette.orange}`,
                paddingBottom: "0.5rem"
              }}
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Members
            </Typography>

            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem",
              }}
              spacing={"2rem"}
              height={"50vh"}
              overflow={"auto"}
              component={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              sx={{
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  background: `${palette.cream}`,
                },
                "&::-webkit-scrollbar-thumb": {
                  background: palette.blue,
                  borderRadius: "3px",
                },
              }}
            >
              {/* Members */}

              {isLoadingRemoveMember ? (
                <CircularProgress sx={{ color: palette.orange }} />
              ) : (
                <AnimatePresence>
                  {members.map((i) => (
                    <motion.div
                      key={i._id}
                      variants={memberVariants}
                      exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                      layout
                    >
                      <UserItem
                        user={i}
                        isAdded
                        styling={{
                          boxShadow: `0 4px 12px rgba(0,0,0,0.08)`,
                          padding: "1rem 2rem",
                          borderRadius: "1rem",
                          background: "white",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: `0 6px 16px rgba(0,0,0,0.12)`,
                            transform: "translateY(-3px)",
                            background: `linear-gradient(to right, white, ${palette.cream})`,
                          }
                        }}
                        handler={removeMemberHandler}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </Stack>

            {ButtonGroup}
          </>
        )}
      </Grid>

      {isAddMember && (
        <Suspense fallback={<Backdrop open sx={{ color: palette.orange }} />}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open sx={{ color: palette.orange }} />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
          "& .MuiDrawer-paper": {
            boxShadow: "0 0 15px rgba(0,0,0,0.2)",
          }
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
      >
        <GroupsList
          w={"50vw"}
          myGroups={myGroups?.data?.groups}
          chatId={chatId}
        />
      </Drawer>
    </Grid>
  );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => {
  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <Stack
      width={w}
      sx={{
        backgroundImage: createGradient(),
        height: "100vh",
        overflow: "auto",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: palette.navy,
        },
        "&::-webkit-scrollbar-thumb": {
          background: palette.orange,
          borderRadius: "3px",
        },
      }}
      component={motion.div}
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      {myGroups.length > 0 ? (
        myGroups.map((group) => (
          <motion.div 
            key={group._id}
            variants={itemVariants}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <GroupListItem group={group} chatId={chatId} />
          </motion.div>
        ))
      ) : (
        <Fade in={true} timeout={1000}>
          <Typography 
            textAlign={"center"} 
            padding="1rem"
            sx={{
              color: palette.cream,
              opacity: 0.8,
              fontStyle: "italic"
            }}
          >
            No groups
          </Typography>
        </Fade>
      )}
    </Stack>
  );
};

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  const isActive = chatId === _id;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (isActive) e.preventDefault();
      }}
      sx={{
        background: isActive ? `${palette.orange}30` : "transparent",
        borderLeft: isActive ? `4px solid ${palette.orange}` : "4px solid transparent",
        transition: "all 0.3s ease",
        "&:hover": {
          background: `${palette.orange}20`,
          transform: "translateX(5px)",
        }
      }}
    >
      <Stack 
        direction={"row"} 
        spacing={"1rem"} 
        alignItems={"center"}
        sx={{
          padding: "0.75rem 1rem",
        }}
      >
        <AvatarCard 
          avatar={avatar} 
          sx={{
            border: isActive ? `2px solid ${palette.orange}` : "none",
            transition: "all 0.3s ease",
          }}
        />
        <Typography sx={{ 
          color: palette.cream,
          fontWeight: isActive ? "600" : "400",
          transition: "all 0.3s ease",
        }}>
          {name}
        </Typography>
      </Stack>
    </Link>
  );
});

export default Groups;