const router = require('express').Router();

const apiRoutes = require('./apiRoutes.js');
const homeRoutes = require('./homeRoutes.js');

router.use('/', homeRoutes);
router.use('/user', apiRoutes);

module.exports = router;