var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var stationSchema = new Schema({

    imp_uid: String, //고유ID
    merchant_uid: String, //상점 거래ID
    paid_amount: Number, //결제금액
    apply_num: String, //카드 승인번호

    buyer_email: String, //이메일
    buyer_name: String, //구매자 성함

    status: String, //결재완료, 배송중 등등

    createdAt: {
        type: Date,
        default: Date.now()
      },
    }, {
        toObject: {
        virtuals: true
        }
    });

// virtuals
stationSchema.virtual("createdDate")
.get(function () {
  return util.getDate(this.createdAt);
});

stationSchema.virtual("createdTime")
.get(function () {
  return util.getTime(this.createdAt);
});

stationSchema.virtual('getAmountFormat').get(function(){  
    // 1000원을 1,000원으로 바꿔준다.
    return new Intl.NumberFormat().format(this.paid_amount); //구글에 NumberFormat 검색
});

stationSchema.plugin(autoIncrement.plugin, {
    model: "station",
    field: "id",
    startAt: 1
});

module.exports = mongoose.model("station", stationSchema);