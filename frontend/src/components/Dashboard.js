import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../utils/axiosConfig";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "../AuthContext";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Dashboard = () => {
  const { token } = useAuth();
  const [kpis, setKpis] = useState({
    totalProducts: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    orders: [],
    productCategories: [],
  });
  const [blockchainData, setBlockchainData] = useState([]); // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const authHeader = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const [productsResponse, ordersResponse, blockchainResponse] =
          await Promise.all([
            axios.get("http://localhost:5001/api/products", authHeader),
            axios.get("http://localhost:5001/api/orders", authHeader),
            axios.get("http://localhost:5001/api/blockchain", authHeader),
          ]);

        const totalProducts = productsResponse.data.length;
        const totalOrders = ordersResponse.data.length;
        const averageOrderValue = calculateAverageOrderValue(
          ordersResponse.data
        );
        const productCategories = calculateProductCategories(
          productsResponse.data
        );

        setKpis({
          totalProducts,
          totalOrders,
          averageOrderValue,
          orders: ordersResponse.data,
          productCategories,
        });

        setBlockchainData(blockchainResponse.data); // eslint-disable-next-line no-unused-vars
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const calculateAverageOrderValue = (orders) => {
    if (orders.length === 0) return 0;
    const totalValue = orders.reduce((sum, order) => sum + order.quantity, 0);
    return totalValue / orders.length;
  };

  const calculateOrderTrend = (orders) => {
    const monthlyOrders = {};
    orders.forEach((order) => {
      if (order.created_at) {
        const date = new Date(order.created_at);
        if (!isNaN(date.getTime())) {
          const month = date.toLocaleString("default", { month: "short" });
          monthlyOrders[month] = (monthlyOrders[month] || 0) + 1;
        }
      }
    });
    return Object.entries(monthlyOrders).map(([month, count]) => ({
      month,
      count,
    }));
  };

  const calculateProductCategories = (products) => {
    const categories = {};
    products.forEach((product) => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  const orderTrendData = calculateOrderTrend(kpis.orders); // eslint-disable-next-line no-unused-vars
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]; // eslint-disable-next-line no-unused-vars

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Healthcare Inventory Dashboard
      </Typography>

      <Box sx={{ textAlign: "center", my: 2 }}>
        <img
          src="https://undraw.co/api/illustrations/undraw_doctors_hwty.svg"
          alt="Healthcare Illustration"
          style={{ maxWidth: "100%", height: 200 }}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <InventoryIcon color="primary" fontSize="large" />
            <Box>
              <Typography variant="subtitle2">Total Products</Typography>
              <Typography variant="h6">{kpis.totalProducts}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <ShoppingCartIcon color="secondary" fontSize="large" />
            <Box>
              <Typography variant="subtitle2">Total Orders</Typography>
              <Typography variant="h6">{kpis.totalOrders}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <LocalHospitalIcon sx={{ color: "#4caf50" }} fontSize="large" />
            <Box>
              <Typography variant="subtitle2">Avg. Order Quantity</Typography>
              <Typography variant="h6">{kpis.averageOrderValue.toFixed(2)}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
