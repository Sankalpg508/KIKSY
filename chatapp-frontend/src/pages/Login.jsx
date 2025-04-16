import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { palette } from "../constants/color";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");

  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging In...");

    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );

      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const formVariants = {
    initial: { 
      opacity: 0,
      y: 20,
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const avatarVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 8px rgba(0,0,0,0.3)",
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.03,
      boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
      backgroundColor: palette.maroon,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.97 }
  };

  const paperGradient = `linear-gradient(135deg, ${palette.cream} 0%, ${palette.cream} 100%)`;

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(135deg, ${palette.navy} 0%, ${palette.blue} 100%)`,
        height: "100vh",
        width: "100vw",
      }}
    >
      <Container
        component={motion.main}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: paperGradient,
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            overflow: "hidden",
          }}
        >
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={formVariants}
                style={{ width: "100%" }}
              >
                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="h4" 
                    color={palette.navy}
                    sx={{ 
                      fontWeight: "bold",
                      textAlign: "center",
                      mb: 3
                    }}
                  >
                    Welcome Back
                  </Typography>
                </motion.div>
                
                <form
                  style={{
                    width: "100%",
                  }}
                  onSubmit={handleLogin}
                >
                  <motion.div variants={itemVariants}>
                    <TextField
                      required
                      fullWidth
                      label="Username"
                      margin="normal"
                      variant="outlined"
                      value={username.value}
                      onChange={username.changeHandler}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: palette.blue,
                          },
                          "&:hover fieldset": {
                            borderColor: palette.blue,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: palette.blue,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: palette.navy,
                        },
                      }}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <TextField
                      required
                      fullWidth
                      label="Password"
                      type="password"
                      margin="normal"
                      variant="outlined"
                      value={password.value}
                      onChange={password.changeHandler}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: palette.blue,
                          },
                          "&:hover fieldset": {
                            borderColor: palette.blue,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: palette.blue,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: palette.navy,
                        },
                      }}
                    />
                  </motion.div>

                  <motion.div 
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      sx={{
                        marginTop: "2rem",
                        backgroundColor: palette.orange,
                        color: "white",
                        fontWeight: "bold",
                        padding: "0.8rem",
                        "&:hover": {
                          backgroundColor: palette.maroon,
                        },
                      }}
                      variant="contained"
                      type="submit"
                      fullWidth
                      disabled={isLoading}
                    >
                      Login
                    </Button>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Typography 
                      textAlign={"center"} 
                      m={"1.5rem"} 
                      color={palette.navy}
                    >
                      OR
                    </Typography>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      disabled={isLoading}
                      fullWidth
                      variant="text"
                      onClick={toggleLogin}
                      sx={{
                        color: palette.blue,
                        "&:hover": {
                          backgroundColor: "rgba(21, 97, 109, 0.1)",
                        },
                      }}
                    >
                      Sign Up Instead
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={formVariants}
                style={{ width: "100%" }}
              >
                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="h4" 
                    color={palette.navy}
                    sx={{ 
                      fontWeight: "bold",
                      textAlign: "center",
                      mb: 3
                    }}
                  >
                    Create Account
                  </Typography>
                </motion.div>
                
                <form
                  style={{
                    width: "100%",
                  }}
                  onSubmit={handleSignUp}
                >
                  <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                    <motion.div
                      variants={avatarVariants}
                      whileHover="hover"
                    >
                      <Avatar
                        sx={{
                          width: "10rem",
                          height: "10rem",
                          objectFit: "contain",
                          border: `4px solid ${palette.orange}`,
                        }}
                        src={avatar.preview}
                      />
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconButton
                        sx={{
                          position: "absolute",
                          bottom: "0",
                          right: "0",
                          color: "white",
                          bgcolor: palette.blue,
                          ":hover": {
                            bgcolor: palette.navy,
                          },
                          padding: "0.8rem",
                        }}
                        component="label"
                      >
                        <>
                          <CameraAltIcon />
                          <VisuallyHiddenInput
                            type="file"
                            onChange={avatar.changeHandler}
                          />
                        </>
                      </IconButton>
                    </motion.div>
                  </Stack>

                  {avatar.error && (
                    <Typography
                      m={"1rem auto"}
                      width={"fit-content"}
                      display={"block"}
                      color="error"
                      variant="caption"
                    >
                      {avatar.error}
                    </Typography>
                  )}

                  <motion.div variants={itemVariants}>
                    <TextField
                      required
                      fullWidth
                      label="Name"
                      margin="normal"
                      variant="outlined"
                      value={name.value}
                      onChange={name.changeHandler}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: palette.blue,
                          },
                          "&:hover fieldset": {
                            borderColor: palette.blue,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: palette.blue,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: palette.navy,
                        },
                      }}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <TextField
                      required
                      fullWidth
                      label="Bio"
                      margin="normal"
                      variant="outlined"
                      value={bio.value}
                      onChange={bio.changeHandler}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: palette.blue,
                          },
                          "&:hover fieldset": {
                            borderColor: palette.blue,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: palette.blue,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: palette.navy,
                        },
                      }}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <TextField
                      required
                      fullWidth
                      label="Username"
                      margin="normal"
                      variant="outlined"
                      value={username.value}
                      onChange={username.changeHandler}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: palette.blue,
                          },
                          "&:hover fieldset": {
                            borderColor: palette.blue,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: palette.blue,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: palette.navy,
                        },
                      }}
                    />
                  </motion.div>

                  {username.error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography color="error" variant="caption">
                        {username.error}
                      </Typography>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants}>
                    <TextField
                      required
                      fullWidth
                      label="Password"
                      type="password"
                      margin="normal"
                      variant="outlined"
                      value={password.value}
                      onChange={password.changeHandler}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: palette.blue,
                          },
                          "&:hover fieldset": {
                            borderColor: palette.blue,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: palette.blue,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: palette.navy,
                        },
                      }}
                    />
                  </motion.div>

                  <motion.div 
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      sx={{
                        marginTop: "2rem",
                        backgroundColor: palette.orange,
                        color: "white",
                        fontWeight: "bold",
                        padding: "0.8rem",
                        "&:hover": {
                          backgroundColor: palette.maroon,
                        },
                      }}
                      variant="contained"
                      type="submit"
                      fullWidth
                      disabled={isLoading}
                    >
                      Sign Up
                    </Button>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Typography 
                      textAlign={"center"} 
                      m={"1.5rem"} 
                      color={palette.navy}
                    >
                      OR
                    </Typography>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      disabled={isLoading}
                      fullWidth
                      variant="text"
                      onClick={toggleLogin}
                      sx={{
                        color: palette.blue,
                        "&:hover": {
                          backgroundColor: "rgba(21, 97, 109, 0.1)",
                        },
                      }}
                    >
                      Login Instead
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;