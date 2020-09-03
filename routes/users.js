var express = require('express');
var router = express.Router();

router.get("/", function(req,res){
  res.render("users/login");
});

router.get("/register", function(req,res){
  res.render("users/register");
});

module.exports = router;
