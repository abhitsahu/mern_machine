const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ token });
};

exports.registerAdmin = async (req, res) => {
    const { email, password } = req.body;
  
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Admin already exists" });
    }
  
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new admin user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
  
    res.status(201).json({ message: "Admin registered successfully" });
  };
