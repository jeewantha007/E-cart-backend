const connection = require("../db/db-connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

// ✅ User Registration
const userRegister = (req, res) => {
  const { name, email, contact_no, password } = req.body;

  if (!name || !email || !contact_no || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error("Hashing error:", err);
      return res.status(500).json({ error: "Password encryption failed." });
    }

    const sql = "INSERT INTO user (name, email, contact_no, password) VALUES (?, ?, ?, ?)";
    const values = [name, email, contact_no, hash];

    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database insert failed." });
      }

      return res.status(201).json({ message: "User registered successfully." });
    });
  });
};

// ✅ User Login + JWT Token Generation
const userLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  connection.query("SELECT * FROM user WHERE email = ?", [email], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("Bcrypt error:", err);
        return res.status(500).json({ error: "Server error" });
      }

      if (result) {
        // ✅ Create JWT token
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.json({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            contact_no: user.contact_no,
            role: user.role 
          }
        });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    });
  });
};


const getAllUsers = (req, res) => {
   const sql = 'SELECT * FROM user WHERE role = "user"';
    
      connection.query(sql, (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Error fetching products', error: err });
        }
    
        res.status(200).json(results)
       
        
      });
    };




module.exports = { userRegister, userLogin ,getAllUsers };
