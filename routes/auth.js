const express = require('express');
const { procesarLogin } = require('../controller/authController');
const router = express.Router();

// POST /api/login
router.post('/login', procesarLogin);

module.exports = router;