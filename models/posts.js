const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
description : {
    type: String
},
userId :{
    type : Number,
    required: true
},
likes :{
    type : Number,
    required: true
},
isDelete :{
    type: false
}
},{timestamps:true});
 module.exports = mongoose.model('newuser', UserSchema);


