import { useInputValidation } from "6pp";
import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Fade,
  Zoom,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { bgGradient, palette } from "../../constants/color";
import { adminLogin, getAdmin } from "../../redux/thunks/admin";
import { AdminPanelSettings as AdminPanelSettingsIcon } from "@mui/icons-material";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const { isAdmin } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const secretKey = useInputValidation("");

  const submitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(adminLogin(secretKey.value))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  if (isAdmin) return <Navigate to="/admin/dashboard" />;

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${palette.navy} 0%, ${palette.blue} 100%)`,
        minHeight: "100vh",
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Fade in timeout={1000}>
          <Paper
            elevation={6}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: "16px",
              background: `linear-gradient(145deg, #fff, ${palette.cream})`,
              boxShadow: `0 10px 30px rgba(0,0,0,0.2)`,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            >
              <Box sx={{ 
                background: palette.blue, 
                color: "#fff", 
                padding: "16px", 
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
                boxShadow: `0 4px 10px ${palette.blue}88`
              }}>
                <AdminPanelSettingsIcon sx={{ fontSize: "3rem" }} />
              </Box>
            </motion.div>
            
            <Typography 
              variant="h5" 
              sx={{ 
                color: palette.navy, 
                fontWeight: "bold",
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-10px",
                  left: "25%",
                  width: "50%",
                  height: "4px",
                  background: palette.orange,
                  borderRadius: "2px"
                }
              }}
            >
              Admin Login
            </Typography>
            
            <form
              style={{
                width: "100%",
                marginTop: "2rem",
              }}
              onSubmit={submitHandler}
            >
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <TextField
                  required
                  fullWidth
                  label="Secret Key"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={secretKey.value}
                  onChange={secretKey.changeHandler}
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
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: palette.blue,
                    },
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  sx={{
                    marginTop: "1.5rem",
                    background: `linear-gradient(to right, ${palette.blue}, ${palette.navy})`,
                    borderRadius: "8px",
                    padding: "12px 0",
                    fontWeight: "bold",
                    textTransform: "none",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background: `linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)`,
                      transition: "all 0.6s ease",
                    },
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: `0 6px 20px ${palette.navy}66`,
                      "&:before": {
                        left: "100%",
                      },
                    },
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </motion.div>
            </form>
          </Paper>
        </Fade>
      </Container>
    </div>
  );
};

export default AdminLogin;