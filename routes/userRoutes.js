const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, deleteUser, login } = require('../controllers/userController');

// Routes
router.post('/', createUser);
router.get('/', getAllUsers);
router.delete('/:id', deleteUser);
router.post('/login', login);

module.exports = router;
