var mongoose=require('mongoose');

var schema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'accounts'
    },
    order_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'orders'
    },
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

var clientorders=mongoose.model('clientorders',schema);
module.exports=clientorders;