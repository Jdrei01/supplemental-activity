const router = require('express').Router();
const userRoutes = require('./userRoutes');
const apiRoutes = require('./api');

router.use('/api', apiRoutes);
router.use('/api/users', userRoutes);

module.exports = router;