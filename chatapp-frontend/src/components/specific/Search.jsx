import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
  Typography,
  Fade,
  Grow,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation } from "../../hooks/hook";
import { motion, AnimatePresence } from "framer-motion";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";
import { palette } from "../../constants/color";



const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );
  const dispatch = useDispatch();
  const search = useInputValidation("");
  const [users, setUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  const searchCloseHandler = () => dispatch(setIsSearch(false));

  useEffect(() => {
    if (search.value.trim() === "") {
      setUsers([]);
      setIsSearching(false);
      setNoResults(false);
      return;
    }

    setIsSearching(true);
    setNoResults(false);

    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => {
          setUsers(data.users);
          setIsSearching(false);
          setNoResults(data.users.length === 0);
        })
        .catch((e) => {
          console.log(e);
          setIsSearching(false);
        });
    }, 800);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Dialog 
      open={isSearch} 
      onClose={searchCloseHandler}
      TransitionComponent={Grow}
      transitionDuration={400}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          backgroundColor: palette.cream,
          overflow: "hidden",
          minWidth: { xs: "90%", sm: "400px" },
          maxWidth: "450px"
        }
      }}
    >
      <Stack 
        p={{ xs: "1.5rem", sm: "2rem" }}
        spacing={2}
        sx={{
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "5px",
            background: `linear-gradient(to right, ${palette.blue}, ${palette.orange})`,
          }
        }}
      >
        <Fade in={isSearch} timeout={600}>
          <DialogTitle 
            textAlign={"center"}
            sx={{ 
              color: palette.navy,
              fontWeight: 600,
              fontSize: { xs: "1.5rem", sm: "1.8rem" },
              pb: 1,
              pt: 0,
              px: 0
            }}
          >
            Find People
          </DialogTitle>
        </Fade>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <TextField
            placeholder="Search by name or username..."
            value={search.value}
            onChange={search.changeHandler}
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                "& fieldset": {
                  borderColor: palette.blue,
                  borderWidth: "1px",
                },
                "&:hover fieldset": {
                  borderColor: palette.orange,
                },
                "&.Mui-focused fieldset": {
                  borderColor: palette.maroon,
                  borderWidth: "2px",
                },
              },
              mb: 1
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: palette.blue }} />
                </InputAdornment>
              ),
            }}
          />
        </motion.div>

        <Divider sx={{ bgcolor: `${palette.blue}20` }} />

        <List
          sx={{
            maxHeight: "350px",
            overflow: "auto",
            pt: 1,
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
          <AnimatePresence>
            {isSearching ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Stack 
                  direction="row" 
                  justifyContent="center" 
                  alignItems="center" 
                  py={4}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ color: palette.blue, fontStyle: "italic" }}
                  >
                    Searching...
                  </Typography>
                </Stack>
              </motion.div>
            ) : noResults && search.value ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Stack 
                  alignItems="center" 
                  justifyContent="center" 
                  spacing={1} 
                  py={4}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ color: palette.navy, fontWeight: 500 }}
                  >
                    No users found
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ color: palette.blue, textAlign: "center" }}
                  >
                    Try a different search term
                  </Typography>
                </Stack>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {users.map((user, index) => (
                  <motion.div
                    key={user._id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <UserItem
                      user={user}
                      handler={addFriendHandler}
                      handlerIsLoading={isLoadingSendFriendRequest}
                      styling={{
                        bgcolor: "transparent",
                        borderRadius: "8px",
                        mb: 1,
                        "&:hover": {
                          bgcolor: `${palette.blue}15`,
                        },
                        transition: "all 0.3s ease"
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!isSearching && users.length === 0 && !noResults && !search.value && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Stack 
                alignItems="center" 
                justifyContent="center" 
                spacing={1} 
                py={4}
              >
                <SearchIcon sx={{ fontSize: 40, color: `${palette.blue}50` }} />
                <Typography 
                  variant="body2" 
                  sx={{ color: palette.blue, textAlign: "center" }}
                >
                  Start typing to search for users
                </Typography>
              </Stack>
            </motion.div>
          )}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;