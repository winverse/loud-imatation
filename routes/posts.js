var express  = require("express");
var router   = express.Router();
var util     = require("../util");

var CommentsModel = require("../models/CommentsModel");
var Post     = require("../models/PostModel");

// Index
router.get("/", function(req, res){
  Post.find({})
  .populate("author")
  .sort("-createdAt")
  .exec(function(err, posts){
    if(err) return res.json(err);
    res.render("posts/index", {
      isLogin : req.user,
      users : req.user, 
      posts:posts
    });
  });
});

// New
router.get("/new", util.isLoggedin, function(req, res){
  var post = req.flash("post")[0] || {};
  var errors = req.flash("errors")[0] || {};
  res.render("posts/new", { 
    users : req.user,
    post:post, errors:errors });
});

// create
router.post("/", util.isLoggedin, function(req, res){
  req.body.author = req.user._id;
  Post.create(req.body, function(err, post){
    if(err){
      req.flash("post", req.body);
      req.flash("errors", util.parseError(err));
      return res.redirect("/posts/new");
    }
    res.redirect("/posts");
  });
});

// show
router.get("/:id", function(req, res){
  Post.findOne({_id:req.params.id})
  .populate("author")
  .exec(function(err, post){
    CommentsModel.find({ post_id : req.params.id } , function(err, comments){
    if(err) return res.json(err);
    res.render("posts/show", {
      users : req.user, 
      isLogin : req.user,
      post:post,
      comments : comments
    });
  });
});
});


// router.get('/products/detail/:id' , function(req, res){
//   //url 에서 변수 값을 받아올떈 req.params.id 로 받아온다
//   ProductsModel.findOne( { 'id' :  req.params.id } , function(err ,product){
//       //제품정보를 받고 그안에서 댓글을 받아온다.
//       CommentsModel.find({ product_id : req.params.id } , function(err, comments){
//           res.render('admin/productsDetail', { product: product , comments : comments });
//       });        
//   });
// });

// edit
router.get("/:id/edit", util.isLoggedin, checkPermission, function(req, res){
  var post = req.flash("post")[0];
  var errors = req.flash("errors")[0] || {};
  if(!post){
    Post.findOne({_id:req.params.id}, function(err, post){
      if(err) return res.json(err);
      res.render("posts/edit", {
        users : req.user,
        isLogin : req.user,
        post:post, errors:errors });
    });
  } else {
    post._id = req.params.id;
    res.render("posts/edit", { 
      users : req.user,
      isLogin : req.user,
      post:post, errors:errors });
  }
});

// update
router.put("/:id", util.isLoggedin, checkPermission, function(req, res){
  req.body.updatedAt = Date.now();
  Post.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, post){
    if(err){
      req.flash("post", req.body);
      req.flash("errors", util.parseError(err));
      return res.redirect("/posts/"+req.params.id+"/edit");
    }
    res.redirect("/posts/"+req.params.id);
  });
});

// destroy
router.delete("/:id", util.isLoggedin, checkPermission, function(req, res){
  Post.remove({_id:req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect("/posts");
  });
});


//댓글 
router.post('/ajax_comment/insert', function(req,res){
  var comment = new CommentsModel({
      content : req.body.content,
      author : req.user.name,
      post_id : String(req.body.post_id)
  });
  // console.log("req.user.name :" + req.user.name);
  // console.log(String(req.body.post_id));
  // console.log("author :" + comment.author)
  comment.save(function(err, comment){

    console.log("comment :" + comment);
      res.json({
          id : comment.id,
          content : comment.content,
          comment : comment,
          message : "success"
      });
  });
});

router.post('/ajax_comment/delete', function(req, res){
  CommentsModel.remove({ _id : req.body.comment_id } , function(err){
      res.json({ message : "success" });
  });
});

module.exports = router;

// private functions
function checkPermission(req, res, next){
  Post.findOne({'_id': req.params.id}, function(err, post){
    if(err) return res.json(err);
    if(JSON.stringify(post.author) != JSON.stringify(req.user._id)) {
    return util.noPermission(req, res);
    } else {
    next();
    }
  });
}
