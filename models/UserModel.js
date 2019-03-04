var mongoose = require("mongoose");
var bcrypt   = require("bcrypt-nodejs");
var autoIncrement = require('mongoose-auto-increment');

// schema
var userSchema = mongoose.Schema({
  id : {
    type : Number
  },
  job : {
    type : String
  },
  email:{
    type:String,
    required:[true,"이메일은 필수입니다."],
    match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"이메일 양식에 맞춰주세요."],
    trim:true,
    unique:true
  },
  password:{
    type:String,
    required:[true,"패스워드는 필수입니다."],
    select:false
  },
  name:{
    type:String,
    required:[true,"닉네임은 필수입니다."],
    match:[/^.{4,12}$/,"닉네임은 4~12글자 사이입니다."],
    trim:true,
  },
  point : {
    type : Number,
    default : 9999999999
  }
},{
  toObject:{virtuals:true}
});

autoIncrement.initialize(mongoose.connection);

userSchema.plugin( autoIncrement.plugin , 
  {
      model : "User", field : "id" , startAt : 1 
  });


// virtuals DB에 저장되는 값은 password인데, 회원가입, 정보 수정시에는 위 값들이 필요합니다. DB에 저장되지 않아도 되는 정보들은 virtual로 만들어 줍니다.

userSchema.virtual("passwordConfirmation")  
.get(function(){ return this._passwordConfirmation; })
.set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual("originalPassword")
.get(function(){ return this._originalPassword; })
.set(function(value){ this._originalPassword=value; });

userSchema.virtual("currentPassword")
.get(function(){ return this._currentPassword; })
.set(function(value){ this._currentPassword=value; });

userSchema.virtual("newPassword")
.get(function(){ return this._newPassword; })
.set(function(value){ this._newPassword=value; });

// password validation
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = "비밀번호는 최소 8글자이며 알파벳과 숫자를 혼용해주세요";


userSchema.path("password").validate(function(v) {
  var user = this;  //user model

  // create user
  if(user.isNew){ //새로운 유저를 만들경우 
    if(!user.passwordConfirmation){ //유저를 만드는 경우인데 비밀번호 확인란이 비었을 경우
      user.invalidate("passwordConfirmation", "비밀번호를 확인해주세요");
    }
    if(!passwordRegex.test(user.password)){ //정규표현식에 맞게 user.password를 검사합니다.
      user.invalidate("password", passwordRegexErrorMessage); //정규표현식에 맞지 않을 경우 passwordRegexErrorMessage("비밀번호는 최소 8글자이며 알파벳과 숫자를 혼용해주세요")를 발생합니다.
    } else if(user.password !== user.passwordConfirmation) { //유저의 패스워드 항목과 유저의 passwordConfirmation의 항목이 일치 하지 않을 경우
      user.invalidate("passwordConfirmation", "비밀번호가 일치하지 않습니다.");
    }
  }

  //궁금한것 어떻게 user.new 항목에서 user.isNew항목을 가져오고 --> isNew는 mongoose 메소드(디비에 한번도 기록되지 않았음)
  //어떻게  user.password , user.passwordConfirmation 항목을 가져올까? (데이터 전송은 submit할때 발생 --> input의 name값이 user.password , user.passwordConfirmation )

  // update user
  if(!user.isNew){
    if(!user.currentPassword){
      if(ValidationError){
      user.invalidate("currentPassword", "현재 비밀번호를 입력해주세요");
      }
    }
    if(user.currentPassword && !bcrypt.compareSync(user.currentPassword, user.originalPassword)){
      user.invalidate("currentPassword", "현재 비밀번호가 일치하지 않습니다.");
    }
    if(user.newPassword && !passwordRegex.test(user.newPassword)){
      user.invalidate("newPassword", passwordRegexErrorMessage);
    } else if(user.newPassword !== user.passwordConfirmation) {
      user.invalidate("passwordConfirmation", "비밀번호가 일치하지 않습니다.");
    }
  }
});

// hash password
userSchema.pre("save", function (next){
  var user = this;
  if(!user.isModified("password")){
    return next();
  } else {
    user.password = bcrypt.hashSync(user.password);
    return next();
  }
});

// model methods
userSchema.methods.authenticate = function (password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);
};

// model & export
var User = mongoose.model("user" , userSchema);
module.exports = User;
