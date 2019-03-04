var express = require("express");
var router  = express.Router();
var co = require('co');
var multer  =   require('multer');


var contestModel = require('../../models/ContestsModel');
var DBDataModel = require('../../models/DBData');
var participationModel = require('../../models/participationModel');
var chatLogModel = require('../../models/chatLogModel');
var UsersModel =require('../../models/UserModel');

var util     = require("../../util");

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

var upload = multer({ maxCount : 1 , storage : storage, limits : { fileSize: 1024*1000*2 }}).single('uploadfile'); //2MB 제한
var upload2 = multer({ maxCount : 1 , storage : storage, limits : { fileSize: 1024*1000*2 }}).single('uploadfile2'); //2MB 제한
/* indexList  */

router.get("/list", function(req, res){
    var getData = co(function*(){
        return {
            participation : yield contestModel.find({payment:true}).sort({'participation':-1}
            ).limit(5).exec(),
            prize : yield contestModel.find({payment:true}).sort({'totalPrize':-1}
            ).limit(5).exec()
        };
    });
    getData.then(function(result){
        res.render('contestView/indexList', {
            users : req.user,
            participation : result.participation,
            prize : result.prize
        });
    });
});



router.post('/list/logo_ajax/search', function(req,res){
    contestModel.find({contestType : "logo", payment:true }).sort({'createdAt':-1}).limit(10).exec(function(err, contest){
        res.json({
            contest : contest,
        });
    });
});

// indexList

/* audit  */
router.get("/list/audit", function(req, res){
    res.render("contestView/audit",
        {
            users : req.user,
        }
    );
});

// audit 


/* end  */

router.get("/list/end", function(req, res){
        res.render("contestView/end",
        {
            users : req.user,
        }
    );
});

// end  

/* wish  */

router.get("/list/wish", util.isLoggedin, function(req, res){
    res.render("contestView/wish",
    {
        users : req.user,
    }
);
});

// wish  


/*  view   */

router.get("/view/:id", function(req, res, next ){
    contestModel.findOne({'id' : req.params.id}, function(err, contest){
        participationModel.find({'contest_Id' : contest.id}, function(err, parti){
            participationModel.find({'id' : contest.firstWin}, function(err, parti2){
                console.log(parti2);
                res.render("contestView/view", {
                    users : req.user,
                    contest : contest,
                    parti : parti,
                    parti2 : parti2
                });
            });
        });
    });
});




router.get("/list", function(req, res){
    var getData = co(function*(){
        return {
            participation : yield contestModel.find({payment:true}).sort({'participation':-1}
            ).limit(5).exec(),
            prize : yield contestModel.find({payment:true}).sort({'totalPrize':-1}
            ).limit(5).exec()
        };
    });
    getData.then(function(result){
        res.render('contestView/indexList', {
            users : req.user,
            participation : result.participation,
            prize : result.prize
        });
    });
});







/*  //view   */

/*  view/brief   */

router.get("/view/brief/:id", util.isLoggedin, function(req, res, next ){
    contestModel.findOne({'id' : req.params.id}, function(err, contest){
        DBDataModel.find({'_id': contest.DBdataId}, function(err, data){
            res.render("contestView/viewBrief", {
                users : req.user,
                contest : contest,
                data : data
            });
        });
    });
});



router.get('/view/brief/download/:path', util.isLoggedin, function(req, res){
    var path = req.params.path;
    res.download('./public/uploads/'+ path, path);
});


/*  //view/brief   */



/*  view/join   */

router.get('/view/join/:id', util.desingerRequired,  function(req, res, next ){
    contestModel.findOne({'id' : req.params.id}, function(err, contest){
        res.render("contestView/viewJoin", {
            users : req.user,
            contest : contest
        });
    });
});

router.post('/view/join/:id',  function(req, res, next){
    var participation = new participationModel({
        author : req.body.userName,
        partTitle : req.body.partTitle,
        thumnailImage : req.body.thumnailImage,
        detailImage : req.body.detailImage,
        partDescription : req.body.partDescription,
        provision : req.body.provision,
        contest_Id : req.body.contestId
    });
    participation.save(function(err){
        console.log(participation.id);
        if(err){ 
            res.json({success : false, message : err});
        } else {
            contestModel.findOne({'id' : req.params.id}, function(err, contest){
                var query = {
                    parti_id : participation.id
                };
                contestModel.update({'id': req.params.id}, {$push : query}, function(err){
                    if(err){
                        res.json({success : false, message : err});
                    } else {
                        res.redirect('/contest/view/'+ contest.id);
                    }
            });
        });
        }
    });
});

router.post('/join/ajax_thumnail', upload, function(req, res, next){
    // console.log(req.files);
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


router.post('/join/ajax_detail', upload2, function(req, res, next){
    console.log(req.files);
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


/*  //view/join   */



/* entry */
router.get('/entry/:id', function(req, res, next){
    participationModel.findOne({'id' : req.params.id} , function(err , parti){
        contestModel.findOne({'id' : parti.contest_Id}, function(err, contest){
            res.render('contestView/entry', {
                users : req.user,
                parti : parti,
                contest : contest
            });
        });    
    });
});



router.post('/entry/rate_ajax/:id', function(req, res, next){
    // console.log("req.body :  " + JSON.stringify(req.body));
    participationModel.findOne({'id' : req.params.id}, function(err, parti){
        var query = {
            rated : req.body.value
        };
        participationModel.update({'id':req.params.id}, {$set : query}, function(err){
            if(err){
                res.json({success : false, message : err});
            } else {
                res.json({
                    message : "평가 되었습니다."
                });
            }
        });
    });
});


router.post('/entry/passing_ajax/:id', function(req, res, next){
    console.log("req.body :  " + JSON.stringify(req.body));
    participationModel.findOne({'id' : req.params.id}, function(err, parti){
        var query = {
            passing : req.body.partId
        };
        contestModel.update({'id': parti.contest_Id}, {$push : query}, function(err){
            if(err){
                res.json({success : false, message : err});
            } else {
                res.json({
                    message : "success"
                });
            }
        });
    });
});

router.post('/entry/select1_ajax/:id', function(req, res, next){
    console.log("req.body :  " + JSON.stringify(req.body));
    participationModel.findOne({'id' : req.params.id}, function(err, parti){
        var query = {
            firstWin : req.body.partId
        };
        contestModel.update({'id' : parti.contest_Id }, {$set : query}, function(err){
            if(err){
                res.json({success : false, message : err});
            } else {
                res.json({
                    message : "success"
                });
            }
        });
    });
});

router.post('/entry/select2_ajax/:id', function(req, res, next){
    // console.log("req.body :  " + JSON.stringify(req.body));
    participationModel.findOne({'id' : req.params.id}, function(err, parti){
        var query = {
            secondWin : req.body.partId
        };
        contestModel.update({'id' : parti.contest_Id }, {$set : query}, function(err){
            if(err){
                res.json({success : false, message : err});
            } else {
                res.json({
                    message : "success"
                });
            }
        });
    });
});

router.post('/entry/select3_ajax/:id', function(req, res, next){
    // console.log("req.body :  " + JSON.stringify(req.body));
    participationModel.findOne({'id' : req.params.id}, function(err, parti){
        var query = {
            thirdWin : req.body.partId
        };
        contestModel.update({'id' : parti.contest_Id }, {$set : query}, function(err){
            if(err){
                res.json({success : false, message : err});
            } else {
                res.json({
                    message : "success"
                });
            }
        });
    });
});


/* //entry */


/* transfer */

router.get('/transfer/:id', function(req, res, next){
    contestModel.findOne({'id' : req.params.id}, function(err, contest){
        participationModel.find({'id' : contest.firstWin}, function(err, parti){
            participationModel.find({'id' : contest.secondWin}, function(err, parti2){
                participationModel.find({'id' : contest.thirdWin}, function(err, parti3){
                    chatLogModel.find({'contest_id': contest.id}, function(err, chatLog){
                        if(err){
                            res.json({success : false, message : err});
                        } else {
                            res.render('contestView/transfer', {
                                users : req.user,
                                contest : contest,
                                parti : parti,
                                parti2: parti2,
                                parti3: parti3,
                                chatLog : chatLog
                            });
                        }
                    });
                    });
                });                            
            });
        });    
    });



router.post('/transfer/ajax_images/:id', upload, function(req, res, next){
    contestModel.findOne({'id' : req.params.id}, function(err, contest){
        var DBData = new DBDataModel({
            orgFileName : req.file.originalname,
            saveFileName : req.file.filename
        });

    DBData.save(function (err, DBData) { // DB에 저장한다.
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            var result = contest.imageCount + 1;
            var query = {
                imageCount : result
            };
            contestModel.update({'id' : contest.id}, {$set : query}, function(err){
                if(err){
                    res.json({success : false, message : err});
                } else {
                    res.json({
                        message : "파일이 업로드 되었습니다.",
                        DBData : DBData
                    });
                }
            });
            }
        });
    });
});


router.post('/transfer/msgLog/:id', function(req, res, next){
    var chatLog = new chatLogModel({
        contest_id : req.params.id,
        author : req.user.name,
        msg : req.body.msg
    });
    chatLog.save(function(err, chat){
        if(err){
            res.json({success : false, message : err});
        }else{
            res.json({
                message : "success msgUp"
            });
        }
    });
});

router.post('/transfer/imgsLog/:id', function(req, res, next){
    var chatLog = new chatLogModel({
        contest_id : req.params.id,
        author : req.user.name,
        imgs : req.body.imgs
    });
    chatLog.save(function(err, chat){
        if(err){
            res.json({success : false, message : err});
        }else{
            res.json({
                message : "success imageUp"
            });
        }
    });
});


router.post('/transfer/contestend/:id', function(req, res, next){
    console.log("req.body: " + JSON.stringify(req.body));

    UsersModel.findOne({'name':req.body.winner1}, function(err, user1){
        var result1 = parseInt(user1.point) + parseInt(req.body.award1);
        var query1 ={
            point : result1
        };
        UsersModel.update({'id':user1.id}, {$set:query1}, function(err){
            if(err){
                res.json({success : false, message : err});
            }
        });
    });


    if(req.body.winner2 != undefined){
        UsersModel.findOne({'name':req.body.winner2}, function(err, user2){
            var result2 = parseInt(user2.point) + parseInt(req.body.award2);
            var query2 ={
                point : result2
            };
            UsersModel.update({'id':user2.id}, {$set:query2}, function(err){
                if(err){
                    res.json({success : false, message : err});
                }
            });
        });
    }

    if(req.body.winner3 != undefined){
        UsersModel.findOne({'name':req.body.winner3}, function(err, user3){
            var result3 = parseInt(user3.point) + parseInt(req.body.award3);
            var query3 ={
                point : result3
            };
            UsersModel.update({'id':user3.id}, {$set:query3}, function(err){
                if(err){
                    res.json({success : false, message : err});
                }
            });
        });
    }

    var query4 = {
        end : true
    };

    contestModel.findOneAndUpdate({'id': req.body.conId}, {$set:query4}, function(err, contest){
        if(err){
            res.json({success : false, message : err});
        } else {
            res.json({
                message : "success"
            });
        }
    });
}); 
       



/* //transfer */









module.exports = router;