var express = require('express');
var router = express.Router();

/* GET home page / API status */
router.get('/', function(req, res, next) {
  res.json({ message: "Quiz App Backend API (Express Generator)", status: "running" });
});

module.exports = router;
