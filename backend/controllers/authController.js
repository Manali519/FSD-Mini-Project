const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Coerce to a plain string so query operators like {"$ne": null} can't be injected
const normalizeEmail = (email) => String(email ?? '').trim().toLowerCase();

exports.signup =async (req, res) => {
  try {
    const { firstName, lastName, dob, password } = req.body;
    const email = normalizeEmail(req.body.email);

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Role is never taken from the request body; admins are created via the seeder
    const user = await User.create({ firstName, lastName, dob, email, password });

    return res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    console.error("Signup Error:", error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { password, role } = req.body;
    const email = normalizeEmail(req.body.email);

    const user = await User.findOne({ email });

    if (user && typeof password === 'string' && (await user.comparePassword(password))) {
      if (role && user.role !== role) {
        return res.status(403).json({ message: `Access denied. You are not registered as an ${role}.` });
      }

      return res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};
