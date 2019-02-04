var mongoose=require('mongoose');

var schema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        //ref:'useraccounts'
    },
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

var cartproducts=mongoose.model('cartproducts',schema);
module.exports=cartproducts;