var express = require('express');
var router = express.Router();

router.get("/", function(req,res){
  res.render("users/login");
});

router.get("/user-profile", function(req,res){
  res.render("users/user-profile");
});

router.get("/faculty-profile", function(req,res){
  res.render("users/faculty-profile");
});

module.exports = router;
