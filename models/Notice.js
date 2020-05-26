var mongoose = require('mongoose');

var noticeSchema = mongoose.Schema({
    title:{type:String, required:[true,'Title is required!']},
    body:{type:String, required:[true,'Body is required!']},
    author:{type:String, ref:'user', required:true},
    views:{type:Number, default:0},
    numId:{type:Number},
    attachment:{type:mongoose.Schema.Types.ObjectId, ref:'file'},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date},
  });

  var Notice = mongoose.model('notice',noticeSchema);

  module.exports = Notice;

  