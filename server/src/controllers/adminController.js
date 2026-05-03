const prisma = require('../utils/prismaClient');
const asyncHandler = require('../utils/asyncHandler');

const getMembers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    where: { role: 'MEMBER' },
    select: { id: true, name: true, email: true, status: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
});

const getAdmins = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    where: { role: 'ADMIN', id: { not: req.user.id } },
    select: { id: true, name: true, email: true, status: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['APPROVED', 'DENIED'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  const user = await prisma.user.update({
    where: { id: req.params.userId },
    data: { status },
    select: { id: true, name: true, email: true, status: true },
  });
  res.json(user);
});

module.exports = { getMembers, getAdmins, updateUserStatus };