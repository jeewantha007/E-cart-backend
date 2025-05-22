const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const app = express();
const port = 3000;

app.use(cors()); // ✅ Allow all origins
app.use(express.urlencoded());
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

// Import all route files just once
const userRoutes = require("./routes/user-route");
const productRoutes = require("./routes/products-route");
const transactionRoutes = require("./routes/transaction-route");
const orderRoutes = require("./routes/orders-route");
const categoryRoutes = require("./routes/category-route");
const dashboardRoutes = require("./routes/dashboard-route");
const ratingsRoutes = require("./routes/ratings-route");

// Mount route files just once under a base path
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/transaction", transactionRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/ratings",ratingsRoutes);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
