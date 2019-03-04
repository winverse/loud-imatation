var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var util = require("../util");

var chatLogSchema = new Schema({
  contest_id : Number,
  author:String,
    msg : {
        type: String,
    },
    imgs : {
        type: String,
    },
  createdAt: {
    type: Date,
    default: Date.now
  },
}, {
  toObject: {
    virtuals: true
  }
});

// virtuals
chatLogSchema.virtual("createdDate")
  .get(function () {
    return util.getDate(this.createdAt);
  });

  chatLogSchema.virtual("createdTime")
  .get(function () {
    return util.getTime(this.createdAt);
  });


  chatLogSchema.plugin(autoIncrement.plugin, {
  model: "chatLog",
  field: "id",
  startAt: 1
});
module.exports = mongoose.model("chatLog", chatLogSchema);