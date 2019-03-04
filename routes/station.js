var express = require("express");
var router  = express.Router();

var stationModel = require('../models/StationModel');

var util = require("../util");


// Home
router.get("/point", util.isLoggedin, function(req, res){
  res.render("station/station",
    {
      users : req.user,
    }
  );
});

router.post('/complete', function(req, res){
  
  var station = new stationModel({
      imp_uid : req.body.imp_uid,
      merchant_uid : req.body.merchant_uid,
      paid_amount : req.body.paid_amount,
      apply_num : req.body.apply_num,
      buyer_email : req.body.buyer_email,
      buyer_name : req.body.buyer_name,
      status : req.body.status,
  });

  station.save(function(err){

      res.json({message:"success"});
      
  });
}); 


router.get('/success', function(req,res){
    res.render('station/success',{
      users : req.user
    });
});


module.exports = router;