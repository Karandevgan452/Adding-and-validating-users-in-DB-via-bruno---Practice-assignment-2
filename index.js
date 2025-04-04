require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./Schema");
const bcrypt = require("bcrypt");
const { resolve } = require("path");

const app = express();
const port = 3000;

app.use(express.static("static"));
app.use(express.json());

//MONGODB Connection (Used same mongodb of previous assignment for register)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Failed: ", err));

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password fields both are required" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch)
      return res
        .status(200)
        .json({ success: true, message: "Logged in successfully", user });
    else return res.status(401).json({ message: "Inavlid credentials" });
  } catch (err) {
    console.error("Error logging : ", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port at http://localhost:${port}`);
});
