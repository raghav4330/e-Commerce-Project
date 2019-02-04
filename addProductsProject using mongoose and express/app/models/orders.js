var mongoose=require('mongoose');

var schema=mongoose.Schema({
     _id:mongoose.Schema.Types.ObjectId,
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'accounts'
    },
    username:String,
    email:String,
    address:String,
    created:Date,
    updated:{
        type:Date,
        default:Date.now()
    },
    status:Number,
    data:[{
        _id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'products'
        },
        name:String,
        price:Number,
        cquantity:Number
    }]
});

var orders=mongoose.model('orders',schema);
module.exports=orders;