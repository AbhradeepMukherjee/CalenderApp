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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningUp) {
      setIsSigningUp(true);
      try {
        const res = await doCreateUserWithEmailAndPassword(email, password);
        const firebaseUid = res?.user?.uid;
        if(!firebaseUid){
          throw new Error('Failed to retrieve data!');
        }
        const resp = await fetch("http://localhost:8000/api/v1/signup", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firebaseUid, name, email }),
        })
        if(resp.ok){
          toast.success("Signed up successfully!");
        }else{
          toast.error('Sign up failed!');
        }
      } catch (err) {
        setError(err.message);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsSigningUp(false);
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
            Sign Up
          </Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{ style: { color: "#ffffff" } }}
            InputProps={{ style: { color: "#ffffff" } }}
            sx={{ input: { backgroundColor: "#333" }, mb: 2 }}
            autoComplete="off"
          />
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
          >
            {isSigningUp ? "Signing Up..." : "Sign up"}
          </Button>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Typography variant="body2" style={{ color: "#ffffff" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{ color: "#90caf9", textDecoration: "none" }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Signup;
