const express = require("express");
const cors = require('cors');
require("dotenv").config();
const path = require('path');
const app = express();
const port = 3000;

app.use(cors()); // ✅ Allow all origins
app.use(express.urlencoded());
app.use(express.json());


app.use('/images', express.static(path.join(__dirname, 'images')));



const userRegistration = require("./routes/user-route");
app.use("/api/v1/user", userRegistration);

const userLogin = require("./routes/user-route");
app.use("/api/v1/user", userLogin);

const getAllUsers = require("./routes/user-route");
app.use("/api/v1/user", getAllUsers);

const  uploadProduct = require("./routes/products-route");
app.use("/api/v1/products",uploadProduct);

const  getAllProducts = require("./routes/products-route");
app.use("/api/v1/products",getAllProducts);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
