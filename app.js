var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var methodOverride = require("method-override");
var flash          = require("connect-flash");

var sessionMiddleWare = require('./config/sessionMIddleWare');


var router = require('./routes/root');

//DB Connect
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var autoIncrement = require('mongoose-auto-increment');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log('mongodb connect');
});

var connect = mongoose.connect('mongodb://127.0.0.1:27017/loud12', 
{
    useMongoClient: true
});

autoIncrement.initialize(connect);



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));


app.use(sessionMiddleWare);

app.use(flash());

app.use(function(req, res, next) {
  app.locals.isLogin = req.isAuthenticated();
  //app.locals.urlparameter = req.url; //현재 url 정보를 보내고 싶으면 이와같이 셋팅
  app.locals.userData = req.user; //사용 정보를 보내고 싶으면 이와같이 셋팅
  next();
});


// Passport
app.use(passport.initialize());
app.use(passport.session());


app.use(router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
