import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { doSignInUserWithEmailAndPassword } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
  const { currentUser, userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const res = await doSignInUserWithEmailAndPassword(email, password);
        toast.success("Logged in successfully!");
      } catch (err) {
        setError(err.message);
        toast.error("Something went wrong. Please check your credentials.");
      } finally {
        setIsSigningIn(false);
        navigate("/");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/"} replace={true} />}
      <CssBaseline />
      <Container
        maxWidth="xs"
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: "#2c2c2c",
            padding: { xs: "20px", sm: "30px" },
            borderRadius: "8px",
            width: "100%",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
            maxWidth: { xs: "100%", sm: "400px" },
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              textAlign: "center",
              color: "#ffffff",
              marginBottom: "20px",
            }}
          >
            Login
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ style: { color: "#ffffff" } }}
            InputProps={{ style: { color: "#ffffff" } }}
            sx={{ input: { backgroundColor: "#333" }, mb: 2 }}
            autoComplete="off"
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: "#ffffff" } }}
            InputProps={{
              style: { color: "#ffffff" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    style={{ color: "#ffffff" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ input: { backgroundColor: "#333" } }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: "20px" }}
            disabled={isSigningIn}
          >
            {isSigningIn ? "Signing In..." : "Login"}
          </Button>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Typography variant="body2" style={{ color: "#ffffff" }}>
              Don’t have an account?{" "}
              <Link
                to="/signup"
                style={{ color: "#90caf9", textDecoration: "none" }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Login;
