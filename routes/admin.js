var express = require('express');
var router = express.Router();

router.get("/create", function(req,res){
    res.render("admin/create");
});

module.exports = router;
