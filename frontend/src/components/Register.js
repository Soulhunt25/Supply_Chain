import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  MenuItem,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const ADMIN_SECRET = "SECRET123";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (role === "admin" && adminCode !== ADMIN_SECRET) {
      setError("Invalid admin code. Cannot register as admin.");
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/auth/register", {
        username,
        password,
        role,
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5", // soft neutral background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          p: 4,
          width: 400,
          backgroundColor: "#ffffff", // clean form background
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2, color: "#333" }}>
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ backgroundColor: "#fafafa" }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ backgroundColor: "#fafafa" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ backgroundColor: "#fafafa" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    edge="end"
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            margin="normal"
            required
            fullWidth
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={{ backgroundColor: "#fafafa" }}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          {role === "admin" && (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Admin Code"
              type="password"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              sx={{ backgroundColor: "#fafafa" }}
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "#1976d2", // professional blue
              color: "#fff",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
