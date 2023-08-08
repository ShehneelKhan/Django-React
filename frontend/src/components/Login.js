import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, TextField, Alert } from "@mui/material";

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setError(""); // Clear previous errors

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    axios
      .post("http://localhost:8000/api/token/", { username, password })
      .then((response) => {
        if (response.status === 200) {
          setIsLoggedIn(true);
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.log(error);
        setError("Incorrect username or password.");
      });
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom>
        Login
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
      <Button variant="contained" color="primary" onClick={handleLoginClick}>
        Login
      </Button>
    </Container>
  );
};

export default Login;
