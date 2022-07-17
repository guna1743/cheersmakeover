const mongoose=require('mongoose');
var schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:String,
    services:[String],
    date:String,
    time:String,
    phoneno:String,
    stylist:String
   
})

const Userdb=mongoose.model('userdb',schema);
module.exports=Userdb;