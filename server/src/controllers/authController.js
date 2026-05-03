const bcrypt = require('bcryptjs');
const prisma = require('../utils/prismaClient');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

// ✅ SIGNUP (auto approve)
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: role === 'ADMIN' ? 'ADMIN' : 'MEMBER',
      status: 'APPROVED', // ✅ ALWAYS APPROVED
    },
  });

  const token = generateToken({ id: user.id, role: user.role });

  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});


// ✅ LOGIN (no approval check)
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // ❌ REMOVED approval checks

  const token = generateToken({ id: user.id, role: user.role });

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});


// ✅ GET CURRENT USER
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { signup, login, getMe };