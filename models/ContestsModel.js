var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var util = require("../util");

var ContestSchema = new Schema({
    id : {
        type : Number
    },
    author: String, //작성자
    createdAt: { //만든 날짜.
        type: Date,
        default: Date.now
    },
    payment : { //결제 여부
       type : Boolean,
       default : false
    },
    participation : {  //참여 사람 숫자
        type : Number,
        default:0
    },

    //New
    contestType :{ 
        type: String  
    },
    email:{ 
        type: String,
    },
    name:{ 
        type: String,
    },
    cellPhone : { 
        type: String,
    },

    //brief
    title : { 
        type: String,
    },
    company : { 
        type: String,
    },
    serviceDescription : { 
        type: String,
    },
    category : {
        type : String
    },
    logoStyle :{
        type : Array
    },
    imageRank : {
        type : Array
    },
    range : {
        type : Array
    },
    color : {
        type : String
    },
    purpose : {
        type:Array
    },
    uploadedfile: {
        type : Array
    },
    DBdataId: {
        type : Array
    },
    designDescription :{
        type : String
    },

    //options
    class : {
        type:String
    },
    award1 : {
        type: String
    },
    award2 : {
        type: String
    },
    award3 : {
        type: String
    },
    totalPrize : {
        type: Number
    },
    Commiton:{
        type: String
    },
    period:{
        type: String
    },
    promotion:{
        type: String
    },
    highlight:{
        type: String
    },
    secret:{
        type: String
    },
    NDA:{
        type: String
    },
    topDesigner:{
        type: String
    },
    banner:{
        type: String
    },
    exAd:{
        type: String
    },
    emailAd:{
        type: String
    },
    totalFee :{
        type: String
    },
    VAT :{
        type: String
    },
    registerFee: {
        type : String
    },
    prizeCommiton:{
        type : String
    },
    

    parti_id: {  //참여한 participation_id  목록
        type : Array
    },

    //콘테스트 중

    passing : {
        type : Array,
        validate: [arrayLimit, '{PATH} exceeds the limit of 3']
    },

    firstWin: String,
    secondWin: String,
    thirdWin: String,

    imageCount: {
        type : Number,
        default : 0
    },
    end :{
        type:Boolean,
        default:false
    }
}, {
    toObject: {
        virtuals: true
    }
});

// virtuals
ContestSchema.virtual("createdDate")
    .get(function () {
        return util.getDate(this.createdAt);
    });

    ContestSchema.virtual("createdTime")
    .get(function () {
        return util.getTime(this.createdAt);
    });

    ContestSchema.plugin(autoIncrement.plugin, {
    model: "contests",
    field: "id",
    startAt: 1
});

function arrayLimit(val) {
    return val.length <= 3;
  }

  
module.exports = mongoose.model("contests", ContestSchema);