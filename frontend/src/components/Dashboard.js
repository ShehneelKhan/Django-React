import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import Logout from "./Logout";

const BASE_URL = "http://localhost:8000/api/";

const Dashboard = ({ setIsLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = buildUrl();
        console.log("Fetching products with URL:", url);
        const response = await axios.get(url, {
          withCredentials: true, // Include cookies in the request
        });
        console.log("Response data:", response.data);
        setProducts(response.data);

        axios
          .get(`${BASE_URL}user/`)
          .then((response) => {
            setUsername(response.data.username);
            console.log(response.data.username);
          })

          .catch((error) => {
            console.log("Error fetching username:", error);
          });
      } catch (error) {
        console.log("Error fetching products:", error); // Log the error
        if (error.response && error.response.status === 401) {
          navigate("/");
        }
      }
    };

    fetchProducts();
  }, [navigate, searchQuery, sortField, sortDirection]);

  const buildUrl = () => {
    let url = `${BASE_URL}products/`;

    const queryParams = [];

    if (searchQuery) {
      queryParams.push(`search=${searchQuery}`);
    }

    if (sortField) {
      queryParams.push(
        `ordering=${sortDirection === "asc" ? "" : "-"}${sortField}`
      );
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join("&")}`;
    }

    return url;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
    setSearchQuery(query);
  };

  const handleProductSelect = async (productId) => {
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? { ...product, selected: !product.selected }
        : product
    );

    try {
      await axios.patch(
        `${BASE_URL}product/${productId}/`,
        { selected: !products.find((p) => p.id === productId).selected },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setProducts(updatedProducts);
    } catch (error) {
      console.log("Error updating selected status:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}logout/`);
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="subtitle1">{setUsername.username}</Typography>
          <Logout setIsLoggedIn={setIsLoggedIn} />
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" style={{ marginTop: "2rem" }}>
        <TextField
          label="Search Products"
          fullWidth
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          margin="normal"
        />
        <TableContainer component={Paper} style={{ marginTop: "2rem" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Button onClick={() => handleSort("id")}>ID</Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleSort("name")}>Name</Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleSort("description")}>
                    Description
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleSort("price")}>Price</Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleSort("available_stock")}>
                    Available Stock
                  </Button>
                </TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.available_stock}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleProductSelect(product.id)}
                    >
                      {product.selected ? "Selected" : "Select"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
