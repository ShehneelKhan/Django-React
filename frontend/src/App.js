import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
} from "react-router-dom";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
} from "@mui/material";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Signup from "./components/Signup";

const PrivateRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            React/Django App
          </Typography>
          {isLoggedIn ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" style={{ marginTop: "2rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/signup"
            element={<Signup setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute
                element={<Dashboard setIsLoggedIn={setIsLoggedIn} />}
                isAuthenticated={isLoggedIn}
              />
            }
          />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;

function Home() {
  return (
    <Typography variant="h4" gutterBottom>
      Welcome to the React/Django App!
    </Typography>
  );
}
