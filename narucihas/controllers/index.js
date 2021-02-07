var express = require('express');
var router = express.Router();

router.use('/',require('./home'));
router.use('/has',require('./has'));

module.exports = router;