const prisma = require('../utils/prismaClient');
const asyncHandler = require('../utils/asyncHandler');

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, assigneeId } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  const member = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId: req.user.id, projectId: req.params.projectId } },
  });
  if (!member) return res.status(403).json({ message: 'Access denied' });
  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status || 'TODO',
      priority: priority || 'MEDIUM',
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId: req.params.projectId,
      assigneeId: assigneeId || null,
      createdById: req.user.id,
    },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true } },
    },
  });
  res.status(201).json(task);
});

const getTasks = asyncHandler(async (req, res) => {
  const member = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId: req.user.id, projectId: req.params.projectId } },
  });
  if (!member) return res.status(403).json({ message: 'Access denied' });
  const { status, priority, assigneeId } = req.query;
  const filters = { projectId: req.params.projectId };
  if (status) filters.status = status;
  if (priority) filters.priority = priority;
  if (assigneeId) filters.assigneeId = assigneeId;
  const tasks = await prisma.task.findMany({
    where: filters,
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(tasks);
});

const updateTask = asyncHandler(async (req, res) => {
  const member = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId: req.user.id, projectId: req.params.projectId } },
  });
  if (!member) return res.status(403).json({ message: 'Access denied' });
  const { title, description, status, priority, dueDate, assigneeId } = req.body;
  const task = await prisma.task.update({
    where: { id: req.params.taskId },
    data: {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      ...(assigneeId !== undefined && { assigneeId }),
    },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true } },
    },
  });
  res.json(task);
});

const deleteTask = asyncHandler(async (req, res) => {
  const member = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId: req.user.id, projectId: req.params.projectId } },
  });
  if (!member || member.role !== 'ADMIN') return res.status(403).json({ message: 'Admins only' });
  await prisma.task.delete({ where: { id: req.params.taskId } });
  res.json({ message: 'Task deleted' });
});

const getDashboard = asyncHandler(async (req, res) => {
  const memberships = await prisma.projectMember.findMany({ where: { userId: req.user.id } });
  const projectIds = memberships.map((m) => m.projectId);
  const [total, todo, inProgress, done, overdue] = await Promise.all([
    prisma.task.count({ where: { projectId: { in: projectIds } } }),
    prisma.task.count({ where: { projectId: { in: projectIds }, status: 'TODO' } }),
    prisma.task.count({ where: { projectId: { in: projectIds }, status: 'IN_PROGRESS' } }),
    prisma.task.count({ where: { projectId: { in: projectIds }, status: 'DONE' } }),
    prisma.task.count({
      where: {
        projectId: { in: projectIds },
        dueDate: { lt: new Date() },
        status: { not: 'DONE' },
      },
    }),
  ]);
  const recentTasks = await prisma.task.findMany({
    where: { projectId: { in: projectIds } },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      project: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true } },
    },
  });
  res.json({ total, todo, inProgress, done, overdue, recentTasks });
});

module.exports = { createTask, getTasks, updateTask, deleteTask, getDashboard };