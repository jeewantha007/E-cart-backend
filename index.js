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

const userRegistration = require("./routes/user-route");
app.use("/api/v1/user", userRegistration);

const userLogin = require("./routes/user-route");
app.use("/api/v1/user", userLogin);

const getAllUsers = require("./routes/user-route");
app.use("/api/v1/user", getAllUsers);

const uploadProduct = require("./routes/products-route");
app.use("/api/v1/products", uploadProduct);

const getAllProducts = require("./routes/products-route");
app.use("/api/v1/products", getAllProducts);

const updateProducts = require("./routes/products-route");
app.use("/api/v1/products", updateProducts);

const deleteProducts = require("./routes/products-route");
app.use("/api/v1/products", deleteProducts);

const TransactionRoutes = require("./routes/transaction-route");
app.use("/api/v1/transaction", TransactionRoutes);

const getUserOrders = require("./routes/orders-route");
app.use("/api/v1/orders", getUserOrders);

const getAllOrderHistory = require("./routes/orders-route");
app.use("/api/v1/orders", getAllOrderHistory);

const getPaymentHistory = require("./routes/orders-route");
app.use("/api/v1/orders", getPaymentHistory);

const getClothing = require("./routes/category-route");
app.use("/api/v1/category", getClothing);

const getHomeKitchen = require("./routes/category-route");
app.use("/api/v1/category", getHomeKitchen);

const getAccessories = require("./routes/category-route");
app.use("/api/v1/category", getAccessories);

const getFootwear = require("./routes/category-route");
app.use("/api/v1/category", getFootwear);

const getElectronics = require("./routes/category-route");
app.use("/api/v1/category", getElectronics);



const getTotalUsers = require("./routes/dashboard-route");
app.use("/api/v1/dashboard", getTotalUsers);

const getTotalOrders = require("./routes/dashboard-route");
app.use("/api/v1/dashboard", getTotalOrders);

const getTotalProducts = require("./routes/dashboard-route");
app.use("/api/v1/dashboard", getTotalProducts);

const getTotalRevenue= require("./routes/dashboard-route");
app.use("/api/v1/dashboard", getTotalRevenue);

const setUserRatings= require("./routes/ratings-route");
app.use("/api/v1/ratings", setUserRatings);

const getUserRatings= require("./routes/ratings-route");
app.use("/api/v1/ratings", getUserRatings);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
