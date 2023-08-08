import React from "react";
import axios from "axios";
import { Button } from "@mui/material";

const Logout = ({ setIsLoggedIn }) => {
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/logout/");
      setIsLoggedIn(false);
      localStorage.removeItem("token"); // Clear the token from local storage
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  return (
    <Button variant="outlined" color="primary" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;
