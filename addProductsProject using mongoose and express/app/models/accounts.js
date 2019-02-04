var mongoose=require('mongoose');

var schema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    role:String,//admin or user
    name:String,
    email:String,
    password:String,
    phone:Number,
    address:String,
    created:Date,
    updated:{
        type:Date,
        default:Date.now()
    }
});

var accounts=mongoose.model('accounts',schema);
module.exports=accounts;