var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var util = require("../util");

var ParticipationSchema = new Schema({
  author: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  partTitle : String,
  thumnailImage : String,
  detailImage : String,
  partDescription :String,
  provision : {
      type : Boolean,
      default: false
  },
  contest_Id : Number,
  rated : Number
}, {
  toObject: {
    virtuals: true
  }
});

// virtuals
ParticipationSchema.virtual("createdDate")
  .get(function () {
    return util.getDate(this.createdAt);
  });

  ParticipationSchema.virtual("createdTime")
  .get(function () {
    return util.getTime(this.createdAt);
  });


  ParticipationSchema.plugin(autoIncrement.plugin, {
  model: "participation",
  field: "id",
  startAt: 1
});
module.exports = mongoose.model("participation", ParticipationSchema);