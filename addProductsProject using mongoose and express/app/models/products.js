var mongoose=require('mongoose');

var schema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    category:String,
    description:String,
    price:Number,
    quantity:Number,
    productImage:{
        type:String,
        default:'/uploads/images/default.png'
    },
    created:Date,
    updated:{
        type:Date,
        default:Date.now()
    }
});

var products=mongoose.model('products',schema);
module.exports=products;