const express = require('express');
const { register, login, getMe, updateDetails } = require('../controllers/auth');
const { protect } = require('../middleware/auth'); // Ensure this file exists too

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);

module.exports = router;