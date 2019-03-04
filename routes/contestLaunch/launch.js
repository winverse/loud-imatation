var express = require("express");
var router = express.Router();
var multer  =   require('multer');

var ContestsModel = require('../../models/ContestsModel');
var DBDataModel = require('../../models/DBData');
var UsersModel =require('../../models/UserModel');
var util = require("../../util");

var fs = require("fs"); // 파일시스템 접근을 위한 모듈 호출 

//이미지 저장되는 위치 설정
var path = require('path');
var uploadDir = path.join( __dirname , '../../public/uploads' ); 

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDir);
  },
  filename : function (req, file, callback) { // products-날짜.jpg(png) 저장 
    callback(null, 'products-' + Date.now() + '.'+ file.mimetype.split('/')[1] );
  },
});
var upload = multer({ storage : storage, limits : { fileSize: 1024*1000*5 }}).single('uploadfile'); //5MB 제한



// Home
router.get("/", util.isLoggedin, function (req, res) {
  res.render("contestLaunch/launch", {
    users: req.user,
  });
});


router.get("/new/logo", util.isLoggedin, function (req, res) {
  // ContestsModel.findOne({'id': req.params.id}, function(err, contset){
    res.render("contestLaunch/logo/new", {
      users: req.user,
      user: req.user
    }); 
  });
// });

router.post("/new/logo", function (req, res, next) {
  var contests = new ContestsModel({
    author : req.user.name,
    contestType : req.body.contestType,
    email : req.body.email,
    name : req.body.name,
    cellPhone : req.body.cellPhone,
  }); 
  contests.save(function(err){
    if(err){
      res.json({success : false, message : err});
    } else {
        res.redirect('/launch/new/logo/brief/'+ contests.id );
      }
    });
  });

router.get('/new/logo/brief/:id' , function (req, res, next) {
  ContestsModel.findOne({'id' : req.params.id}, function(err, contest){
    res.render("contestLaunch/logo/brief", {
      contest : contest,
      users: req.user,
      user: req.user
    });
  });
});

router.post('/new/logo/brief/:id', function(req, res, next){
  ContestsModel.findOne({'id' : req.params.id}, function(err, contest){
    var query = {
      title : req.body.title,
      company : req.body.company,
      serviceDescription : req.body.serviceDescription,
      category : req.body.category,
      logoStyle : req.body.logoStyle,
      imageRank : req.body.imageRank,
      range : req.body.ranged,
      color : req.body.color,
      purpose : req.body.purpose,
      uploadedfile : req.body.uploadedfile,
      DBdataId : req.body.DBdataId,
      designDescription : req.body.designDescription
    };
    ContestsModel.update({'id': req.params.id}, {$set : query}, function(err){
      if(err){
        res.json({success : false, message : err});
      } else {
        res.redirect('/launch/new/logo/brief/options/gold/'+ contest.id);
      }
    });
  });
});

//파일 업로드
router.post("/new/ajax_images", upload, function (req, res, next) {
  var DBData = new DBDataModel({
      orgFileName : req.file.originalname,
      saveFileName : req.file.filename
  });

  DBData.save(function (err, DBData) { // DB에 저장한다.
      if (err) {
        res.send(err);
        console.log(err);
      } else {
      res.json({
        message : "파일이 업로드 되었습니다.",
        DBData : DBData
      });
    }
    });
});


router.get("/new/logo/brief/options/bronze/:id" , util.isLoggedin, function (req, res, next) {
  ContestsModel.findOne({'id':req.params.id}, function(err, contest){
    res.render("contestLaunch/logo/optionsB", {
      users: req.user,
      user: req.user,
      contest : contest
    });
  });
});

router.post('/new/logo/brief/options/bronze/:id', function(req, res, next){
  ContestsModel.findOne({'id' : req.params.id}, function(err, contest){
    var query = {
      class : req.body.class,
      award1 : req.body.award1,
      award2 : req.body.award2,
      award3 : req.body.award3,
      totalPrize : req.body.totalPrize,
      commition : req.body.commition,
      period : req.body.period,
      promotion : req.body.promotion,
      highlight : req.body.highlight,
      secret : req.body.secret,
      NDA : req.body.NDA,
      banner : req.body.banner,
      topDesigner :req.body.topDesigner,
      exAd : req.body.exAd,
      emailAd : req.body.emailAd,
      totalFee :req.body.totalFee,
      VAT : req.body.VAT,
      registerFee : req.body.registerFee,
      prizeCommiton : req.body.prizeCommiton
    };
    ContestsModel.update({'id': req.params.id}, {$set : query}, function(err){
      if(err){
        res.json({success : false, message : err});
      } else {
        res.redirect('/launch/new/logo/brief/payment/'+ contest.id);
      }
    });
  });
});


router.get("/new/logo/brief/options/silver/:id" ,util.isLoggedin, function (req, res, next) {
  ContestsModel.findOne({'id':req.params.id}, function(err, contest){
    res.render("contestLaunch/logo/optionsS", {
      users: req.user,
      user: req.user,
      contest : contest
    });
  });
});

router.post('/new/logo/brief/options/silver/:id', function(req, res, next){
  ContestsModel.findOne({'id' : req.params.id}, function(err, contest){
    var query = {
      class : req.body.class,
      award1 : req.body.award1,
      award2 : req.body.award2,
      award3 : req.body.award3,
      totalPrize : req.body.totalPrize,
      commition : req.body.commition,
      period : req.body.period,
      promotion : req.body.promotion,
      highlight : req.body.highlight,
      secret : req.body.secret,
      NDA : req.body.NDA,
      banner : req.body.banner,
      topDesigner :req.body.topDesigner,
      exAd : req.body.exAd,
      emailAd : req.body.emailAd,
      totalFee :req.body.totalFee,
      VAT : req.body.VAT,
      registerFee : req.body.registerFee,
      prizeCommiton : req.body.prizeCommiton
    };
    ContestsModel.update({'id': req.params.id}, {$set : query}, function(err){
      if(err){
        res.json({success : false, message : err});
      } else {
        res.redirect('/launch/new/logo/brief/payment/'+ contest.id);
      }
    });
  });
});


router.get("/new/logo/brief/options/gold/:id" ,util.isLoggedin, function (req, res, next) {
  ContestsModel.findOne({'id':req.params.id}, function(err, contest){
    res.render("contestLaunch/logo/optionsG", {
      users: req.user,
      user: req.user,
      contest : contest
    });
  });
});

router.post('/new/logo/brief/options/gold/:id', function(req, res, next){
  ContestsModel.findOne({'id' : req.params.id}, function(err, contest){
    var query = {
      class : req.body.class,
      award1 : req.body.award1,
      award2 : req.body.award2,
      award3 : req.body.award3,
      totalPrize : req.body.totalPrize,
      commition : req.body.commition,
      period : req.body.period,
      promotion : req.body.promotion,
      highlight : req.body.highlight,
      secret : req.body.secret,
      NDA : req.body.NDA,
      banner : req.body.banner,
      topDesigner :req.body.topDesigner,
      exAd : req.body.exAd,
      emailAd : req.body.emailAd,
      totalFee :req.body.totalFee,
      VAT : req.body.VAT,
      registerFee : req.body.registerFee,
      prizeCommiton : req.body.prizeCommiton
    };
    ContestsModel.update({'id': req.params.id}, {$set : query}, function(err){
      if(err){
        res.json({success : false, message : err});
      } else {
        res.redirect('/launch/new/logo/brief/payment/'+ contest.id);
      }
    });
  });
});


router.get("/new/logo/brief/options/platinum/:id" ,util.isLoggedin, function (req, res, next) {
  ContestsModel.findOne({'id':req.params.id}, function(err, contest){
    res.render("contestLaunch/logo/optionsP", {
      users: req.user,
      user: req.user,
      contest : contest
    });
  });
});

router.post('/new/logo/brief/options/platinum/:id', function(req, res, next){
  ContestsModel.findOne({'id' : req.params.id}, function(err, contest){
    var query = {
      class : req.body.class,
      award1 : req.body.award1,
      award2 : req.body.award2,
      award3 : req.body.award3,
      totalPrize : req.body.totalPrize,
      commition : req.body.commition,
      period : req.body.period,
      promotion : req.body.promotion,
      highlight : req.body.highlight,
      secret : req.body.secret,
      NDA : req.body.NDA,
      banner : req.body.banner,
      topDesigner :req.body.topDesigner,
      exAd : req.body.exAd,
      emailAd : req.body.emailAd,
      totalFee :req.body.totalFee,
      VAT : req.body.VAT,
      registerFee : req.body.registerFee,
      prizeCommiton : req.body.prizeCommiton
    };
    ContestsModel.update({'id': req.params.id}, {$set : query}, function(err){
      if(err){
        res.json({success : false, message : err});
      } else {
        res.redirect('/launch/new/logo/brief/payment/'+ contest.id);
      }
    });
  });
});

router.get("/new/logo/brief/payment/:id" ,util.isLoggedin, function (req, res, next) {
  ContestsModel.findOne({'id':req.params.id}, function(err, contest){
    res.render("contestLaunch/payment", {
      contest: contest,
      users: req.user,
      user: req.user,
    });
  });
});

router.post("/new/logo/brief/payment/:id", function(req, res, next){
  ContestsModel.findOne({'id' : req.params.id}, function(err, contest){
    var query = {
      payment : req.body.paymentB 
    };
    ContestsModel.update({'id': req.params.id}, {$set : query}, function(err){
      if(err){
        res.json({success : false, message : err});
      }
    });
  });
  UsersModel.findOne({'id' : req.user.id}, function(err, user){
    var query = {
      point : parseInt(req.body.uPoint) 
    };
    UsersModel.update({'id': req.user.id}, {$set : query}, function(err){
      if(err){
        res.json({success : false, message : err});
      } else {
        res.redirect('/');
      }
    });
  });
});

router.get("/new/logo&bizcard", util.isLoggedin, function (req, res) {
  res.render("contestLaunch/logo&bizcard/new", {
    users: req.user,
    user: req.user
  });
});

router.get("/new/logo&bizcard/brief", util.isLoggedin, function (req, res) {
  res.render("contestLaunch/logo&bizcard/brief", {
    users: req.user,
    user: req.user
  });
});

module.exports = router;