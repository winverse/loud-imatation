var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var util = require("../util");

var CommentsSchema = new Schema({
  content: String,
  created_at: {
    type: Date,
    default: Date.now()
  },
  post_id: String,
  author: {
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
CommentsSchema.virtual("createdDate")
  .get(function () {
    return util.getDate(this.createdAt);
  });

CommentsSchema.virtual("createdTime")
  .get(function () {
    return util.getTime(this.createdAt);
  });


CommentsSchema.plugin(autoIncrement.plugin, {
  model: "comments",
  field: "id",
  startAt: 1
});
module.exports = mongoose.model("comments", CommentsSchema);