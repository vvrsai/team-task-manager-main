const express = require('express');
const { getMembers, getAdmins, updateUserStatus } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, adminOnly);
router.get('/members', getMembers);
router.get('/admins', getAdmins);
router.patch('/users/:userId/status', updateUserStatus);

module.exports = router;