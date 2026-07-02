const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword
    });

    console.log(`👤 User Saved Successfully: ${user.name} (${user.email}) inside database zenfit.users`);

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error(`❌ User Signup Failed: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log(`🔍 Login Attempt Initiated: Email = "${email}" (Normalized: "${normalizedEmail}")`);
    
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log(`❌ Login Failed: No user account found with email "${normalizedEmail}" in zenfit.users`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`👤 User Account Located: Name = "${user.name}", HashedPassword = "${user.password}"`);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`❌ Login Failed: Incorrect password provided for user "${user.name}"`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`🔑 User Authenticated Successfully: ${user.name} (${user.email}) directly from MongoDB Atlas`);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'supersecretzenfitkey',
      { expiresIn: '30d' }
    );

    const userResponse = user.toObject();
    delete userResponse.password;
    userResponse.id = user._id;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error(`❌ User Login System Error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
  verifyToken
};
