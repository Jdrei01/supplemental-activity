const express = require('express')
const router = express.Router();

const userRoutes = require('./userRoutes');
const apiRoutes = require('./api/index');

router.use('/api', apiRoutes);
router.use('/api/users', userRoutes);

module.exports = router;