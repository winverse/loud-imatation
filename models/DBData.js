var mongoose = require("mongoose"); // MongoDB를 사용하기위해 mongoose 모듈 호출​
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema; // Data의 구조를 잡기위해 Schema 객체 설정​

var dataSchema = new Schema({ // Data 구조 설정
    id : {
        type : Number
    },
    saveFileName :{   // 이미지 파일 명
        type : String
    },
    orgFileName: {
        type : String
    },
    filesize : {
        type : Number
    }
});
// dataSchema를 기반으로하는 DBData 모델을 모듈화함.

dataSchema.plugin(autoIncrement.plugin, {
    model: "dbdata",
    field: "id",
    startAt: 1
  });


module.exports = mongoose.model("dbdata", dataSchema);