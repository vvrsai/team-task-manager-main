const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(protect);
router.post('/', createTask);
router.get('/', getTasks);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

module.exports = router;