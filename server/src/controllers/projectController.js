const prisma = require('../utils/prismaClient');
const asyncHandler = require('../utils/asyncHandler');

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Project name is required' });
  const project = await prisma.project.create({
    data: {
      name,
      description,
      createdById: req.user.id,
      members: {
        create: { userId: req.user.id, role: 'ADMIN' },
      },
    },
    include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } },
  });
  res.status(201).json(project);
});

const getProjects = asyncHandler(async (req, res) => {
  const projects = await prisma.project.findMany({
    where: {
      members: { some: { userId: req.user.id } },
    },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      tasks: true,
    },
  });
  res.json(projects);
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true, role: true } } } },
      tasks: { include: { assignee: { select: { id: true, name: true } } } },
    },
  });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  const isMember = project.members.some((m) => m.userId === req.user.id);
  if (!isMember) return res.status(403).json({ message: 'Access denied' });
  res.json(project);
});

const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const member = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId: req.user.id, projectId: req.params.id } },
  });
  if (!member || member.role !== 'ADMIN') return res.status(403).json({ message: 'Admins only' });
  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: { name, description },
  });
  res.json(project);
});

const deleteProject = asyncHandler(async (req, res) => {
  const member = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId: req.user.id, projectId: req.params.id } },
  });
  if (!member || member.role !== 'ADMIN') return res.status(403).json({ message: 'Admins only' });
  await prisma.task.deleteMany({ where: { projectId: req.params.id } });
  await prisma.projectMember.deleteMany({ where: { projectId: req.params.id } });
  await prisma.project.delete({ where: { id: req.params.id } });
  res.json({ message: 'Project deleted' });
});

const addMember = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const member = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId: req.user.id, projectId: req.params.id } },
  });
  if (!member || member.role !== 'ADMIN') return res.status(403).json({ message: 'Admins only' });
  const userToAdd = await prisma.user.findUnique({ where: { email } });
  if (!userToAdd) return res.status(404).json({ message: 'User not found' });
  const existing = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId: userToAdd.id, projectId: req.params.id } },
  });
  if (existing) return res.status(400).json({ message: 'User already a member' });
  const newMember = await prisma.projectMember.create({
    data: { userId: userToAdd.id, projectId: req.params.id, role: role === 'ADMIN' ? 'ADMIN' : 'MEMBER' },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  res.status(201).json(newMember);
});

const removeMember = asyncHandler(async (req, res) => {
  const member = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId: req.user.id, projectId: req.params.id } },
  });
  if (!member || member.role !== 'ADMIN') return res.status(403).json({ message: 'Admins only' });
  await prisma.projectMember.delete({
    where: { userId_projectId: { userId: req.params.userId, projectId: req.params.id } },
  });
  res.json({ message: 'Member removed' });
});

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject, addMember, removeMember };