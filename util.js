var util = {};

util.parseError = function(errors){

  // console.log("error : "+ errors);
  var parsed = {};
  if(errors.name == 'ValidationError'){ //shema에서 생성된 error
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  } else if(errors.code == "11000" && errors.errmsg.indexOf("email") > 0) { //mongoDB에서 생성된 error
    parsed.email = { message:"이메일이 이미 존재합니다!" };
  } else if(errors.code == "11000" && errors.errmsg.indexOf("name") > 0){
    parsed.name = { message:"닉네임이 이미 존재합니다!" };
  }
  else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
};

util.getDate = function(dateObj){
  if(dateObj instanceof Date)
    return dateObj.getFullYear() + "-" + get2digits(dateObj.getMonth()+1)+ "-" + get2digits(dateObj.getDate());
};

util.getTime = function(dateObj){
  if(dateObj instanceof Date)
    return get2digits(dateObj.getHours()) + ":" + get2digits(dateObj.getMinutes())+ ":" + get2digits(dateObj.getSeconds());
};

util.isLoggedin = function(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else {
    req.flash("errors", {login:"로그인을 먼저 해주세요."});
    res.redirect("/login");
  }
};

util.desingerRequired = function(req, res, next){
    if (!req.isAuthenticated()){ 
      res.send('<script>alert("로그인을 먼저 해주세요!.");location.href="/login";</script>');
    }else{
        if(req.user.job!=='designer'){
          res.send(
            '<script>alert("디자이너만 참여 가능합니다!.");</script>'+
            '<script>history.back();</script>' 
            );
        }else{
            return next();
        }
    }
};

util.clientRequired = function(req, res, next){
  if (!req.isAuthenticated()){ 
    res.send('<script>alert("로그인을 먼저 해주세요!.");location.href="/login";</script>');
  }else{
      if(req.user.job!=='client'){
          res.send(
            '<script>alert("의뢰자만 참여 가능합니다!.");</script>'+
            '<script>history.back();</script>' 
            );
      }else{
          return next();
      }
  }
};


util.noPermission = function(req, res){
  req.flash("errors", {login:"허용되지 않은 접근입니다."});
  req.logout();
  res.redirect("/login");
};

module.exports = util;

// private functions
function get2digits (num){
  return ("0" + num).slice(-2);
}
