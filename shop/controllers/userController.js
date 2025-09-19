exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, { token: null });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { userSchemaJoi, adminSchemaJoi } = require('../schemas/user');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { error } = userSchemaJoi.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, email, token: null });
  await user.save();
  // Генеруємо JWT-токен
  const token = jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1h' });
  user.token = token;
  await user.save();
  res.status(201).json({ message: 'User registered', token });
// Оновити token на true для всіх юзерів
exports.activateTokens = async (req, res) => {
  try {
    await User.updateMany({}, { $set: { token: true } });
    res.json({ message: 'Token activated for all users' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'User not found' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid password' });
    const token = jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.profile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};
