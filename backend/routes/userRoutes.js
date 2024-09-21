const express = require('express');
const { createUser } = require('../controllers/userController');
const authenticateFirebaseToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', authenticateFirebaseToken, createUser);

module.exports = router;