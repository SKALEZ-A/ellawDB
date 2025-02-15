const express = require('express');
const { registerUser, updateUserScore, getUserByUsername, getInvitedUsers, getAllUsers, deleteUser } = require('../controller/userController');

const router = express.Router();

// Register User
router.post('/register', registerUser);

// Update game score by username
router.put('/update-score', updateUserScore);

// Get user by username
router.get('/user/:username', getUserByUsername);

// Get all referred users by inviter username
router.get('/invites/:username', getInvitedUsers);

// Get all users
router.get('/users', getAllUsers);

// Delete user by username
router.delete('/user/:username', deleteUser);

module.exports = router;

