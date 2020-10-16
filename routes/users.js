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
router.get("/faculty-views", function(req,res)
{
  res.render("users/faculty-views");
});
router.get("/faculty-dashboard", function(req,res)
{
  res.render("users/faculty-dashboard");
});
router.get("/user-views", function(req,res)
{
  res.render("users/user-views");
});
router.get("/user-dashboard", function(req,res)
{
  res.render("users/user-dashboard");
});


module.exports = router;
