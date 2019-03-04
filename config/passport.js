var passport      = require("passport");
var LocalStrategy = require("passport-local");
var User          = require("../models/UserModel");

// serialize & deserialize User
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(id, done) {
  User.findOne({_id:id}, function(err, user) {
    done(err, user);
  });
});

// local strategy
passport.use("local-login",
  new LocalStrategy({
      usernameField : "email",
      passwordField : "password",
      passReqToCallback : true
    },
    function(req, email, password, done) {
      User.findOne({email:email}).select({password:1}).exec(function(err, user1){
        User.findOne({'_id': user1._id}, function(err, user){
        if (err) return done(err);
        if (user1 && user1.authenticate(password)){
          return done(null, user);
        } else {
          req.flash("email", email);
          req.flash("errors", {login:"이메일 또는 비밀번호가 일치하지 않습니다."});
          return done(null, false);
        }
      });
      });
    }
  )
);

module.exports = passport;
