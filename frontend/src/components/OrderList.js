import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newOrder, setNewOrder] = useState({
    product_id: "",
    quantity: "",
    status: "pending",
  });
  const [tokenMissing, setTokenMissing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Token not found. Cannot fetch protected data.");
      setTokenMissing(true);
      return;
    }

    fetchOrders(token);
    fetchProducts(token);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const handleAddOrder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Cannot add order: User not authenticated.");
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/orders", newOrder, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewOrder({ product_id: "", quantity: "", status: "pending" });
      fetchOrders(token);
    } catch (error) {
      console.error("Error adding order", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Orders
      </Typography>

      {tokenMissing && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You are not logged in. Please log in to view and manage orders.
        </Alert>
      )}

      <List>
        {orders.map((order) => (
          <ListItem key={order.id}>
            <ListItemText
              primary={`Order #${order.id}`}
              secondary={`Product ID: ${order.product_id}, Quantity: ${order.quantity}, Status: ${order.status}`}
            />
          </ListItem>
        ))}
      </List>

      <Box component="form" onSubmit={handleAddOrder} sx={{ mt: 2 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Product</InputLabel>
          <Select
            value={newOrder.product_id}
            onChange={(e) =>
              setNewOrder({ ...newOrder, product_id: e.target.value })
            }
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Quantity"
          type="number"
          value={newOrder.quantity}
          onChange={(e) =>
            setNewOrder({ ...newOrder, quantity: e.target.value })
          }
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={newOrder.status}
            onChange={(e) =>
              setNewOrder({ ...newOrder, status: e.target.value })
            }
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Add Order
        </Button>
      </Box>
    </Container>
  );
};

export default OrderList;