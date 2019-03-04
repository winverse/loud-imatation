var express = require('express');
var app = express();
var router = express.Router();

var index = require('./index');
var posts = require('./posts');
var users = require('./users');
var launch = require('./contestLaunch/launch');
var contest = require('./contestView/contest');
var station = require('./station');



router.use('/', index);
router.use('/posts', posts);
router.use('/users', users);
router.use('/launch', launch);
router.use('/station', station);
router.use('/contest', contest);



module.exports = router;