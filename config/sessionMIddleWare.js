var session = require('express-session');
var connectMongo = require('connect-mongo');
var mongoose = require('mongoose');
var MongoStore = connectMongo(session);

var sessionMiddleWare = session({
    secret: 'SuperCrown',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 2000 * 60 * 60 //지속시간 2시간
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 14 * 24 * 60 * 60
    })
});

module.exports = sessionMiddleWare;
