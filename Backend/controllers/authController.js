const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db/index");

const generateToken = (payload) => {
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  console.log("JWT_EXPIRATION:", process.env.JWT_EXPIRATION);
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
};

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO myschema.auth (username, password) VALUES ($1, $2)", [username, hashedPassword]);
    res.status(201).json({ message: "User registered successfully" });
    console.log("User registered:", username);
  } catch (error) {
    console.error("Error during user registration:", error); // Add detailed logging
    if (error.code === "23505") {
      return res.status(400).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.query("SELECT * FROM myschema.auth WHERE username = $1", [username]);

    if (!user.rows.length) {
      console.error("User not found:", username); // Add detailed logging
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      console.error("Invalid password for user:", username); // Add detailed logging
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken({ id: user.rows[0].id, username: user.rows[0].username });
    res.json({ token });
  } catch (error) {
    console.error("Error during user login:", error); // Add detailed logging
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser };
