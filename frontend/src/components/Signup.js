import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Button, TextField, Alert } from "@mui/material";

const Signup = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignupClick = () => {
    setError(""); // Clear previous errors

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    axios
      .post("http://localhost:8000/api/signup/", { username, password })
      .then((response) => {
        if (response.status === 201) {
          setIsLoggedIn(true);
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.log(error);
        setError("Username already exists. Please choose another.");
      });
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom>
        Signup
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Username"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSignupClick}>
        Signup
      </Button>
    </Container>
  );
};

export default Signup;
