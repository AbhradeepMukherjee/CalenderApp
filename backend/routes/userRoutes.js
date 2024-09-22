const express = require('express');
const { createUser } = require('../controllers/userController.js');

const router = express.Router();

router.post('/signup', createUser);

module.exports = router;