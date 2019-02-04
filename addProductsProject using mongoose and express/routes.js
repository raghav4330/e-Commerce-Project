var express=require('express')
var fs = require('fs');
var path=require('path')
var bodyparser=require('body-parser')
var session=require('express-session');
var multer=require('multer');
var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
require('./app/connection');
var accounts=require('./app/models/accounts');
var products=require('./app/models/products');
var cartproducts=require('./app/models/cartproducts');
var orders=require('./app/models/orders');
var clientorders=require('./app/models/clientorders');
var routes = express.Router();

var uploadImage=multer({storage: fun('./public/uploads/images')});
function fun(path){
    return  storage = multer.diskStorage({
    destination: function(req, file, cb){ //'./public1/uploads/profile'
      cb(null, path)
    },
    filename: function(req, file, cb){
      cb(null, file.fieldname + '-' + Date.now())
    }
  });
}

routes.use(session({
    secret:'raghav wants ',
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:1000000}
}));

routes.use(bodyparser.json());
routes.use(bodyparser.urlencoded({extended:false}))



function checkLoggedIn(request,response,next)
{
    console.log(request.session.isLoggedIn)  
    console.log('checking is loggedin')
    console.log(request.session.isLoggedIn)  
    if(request.session.isLoggedIn===undefined)
        return response.redirect('/');
    console.log("hello"+request.session.isLoggedIn)   
    next();
}

/*function checkForActiveSession(request,response,next)
{
    console.log('checking logged in');
    if(req.session.header==undefined)
        return next();
    return response.sendFile(path.join(__dirname+'/public/start.html'));
}*/

//----------------------------------------------------------------------------------ACCOUNTS
function createAccount(obj,callback)
{
   account=new accounts({
       _id:new mongoose.Types.ObjectId(),
       name:obj.name,
       email:obj.email,
       role:obj.role,
       password:obj.password,
       address:obj.address,
       created:Date.now()
   });
    account.save(function(err){
        if(err) throw err;
        else
            return callback();
    });
}


function checkSignin(data,callback)
{

    accounts.findOne({email:data.email,password:data.password,role:data.role},function(err,result){
        if(err) throw err;
        if(!result)
           return callback("",false); 
        return callback(result,true);
      });
}
    
function checkExistingUserforSignup(data,callback)
{
      accounts.findOne({email:data.email,role:data.role},function(err,result){
        if(err) throw err;
        if(!result)
            callback(true); 
        else
             callback(false);
       });
}

//----------------------------------------------------------------------------------------------PRODUCTS
function getProducts(callback)
{
    products.find({},function(err,data){
        if(err) throw err;
        callback(data);
    });
}

function storeProducts(obj,callback)   //imagename,
{
    product=new products({
        _id:new mongoose.Types.ObjectId(), 
        name:obj.name,
        description:obj.description,
        price:obj.price,
        quantity:obj.quantity,
        category:obj.category,
        created:Date.now()
//        productImage:imagename
    });
    product.save(function(err){
        if(err) throw err;
        callback({_id:product._id,productImage:product.productImage});
    });
}

function updateProducts(obj,callback)
{
    console.log('in func')
    console.log(obj)
    products.findOneAndUpdate({_id:obj._id},obj,function(error,result){
        if(error) throw error;
        console.log(result);
        callback();
    });
}

function deleteProducts(_id,callback)
{
    products.findOneAndRemove({_id:_id},function(error,result){ 
        if(error) throw error;
        callback();
    });
}
//----------------------------------------------------------------------------------------CARTPRODUCTS

function find(arr,id)
{
    for(var j=0;j<arr.length;j++)
        {
            if(arr[j]._id==id)
                return j;
        }
    return -1;
}

function getCartProducts(header,callback)
{
    id=header._id;
    console.log('getttt '+id)
    cartproducts.findOne({user_id:id},function(error,data){
         if(error) throw error;
        console.log(data);
        
//        products.find({_id:{ $in: data.data._id}},{quantity:1},function(err,res){
//            if(err) throw err;
//            console.log(res)
        
       
        if(data) 
       callback(data.data) ;
        else 
            callback([]);
       // });
    });
}

function addOrUpdateCart(header,data,response)
{
    id=header._id;
    cartproducts.findOne({user_id:id},function(error,result){
        if(error) throw error;
       console.log('in')
        console.log(data);
        if(!result)
            {
                cart=new cartproducts({
                    _id:new  mongoose.Types.ObjectId(),
                    user_id:id,
                    data:[data]
                });
                cart.save(function(err){
                    if(err) throw err;
                    return response.send();
                })
            }
        else
            {
                arr=result.data;
                console.log(arr)
                j=find(arr,data._id);
                console.log(j)
                if(j==-1)
                    {
                        result.data.push(data);
                    }
                else
                    result.data[j]=data;
              result.save(function(err){
                if(err) throw err;
                return response.send();
              }); 
          }
    });    
}

function deleteFromCart(header,data,response)
{
    id=header._id;
    console.log('deleting '+id)
    console.log('product '+data.id)
    if(data.id==-1)
       { cartproducts.findOneAndRemove({user_id:id},function(error,result){ 
        if(error) throw error;
        return response.send();
       });
     }
    else
    {
        cartproducts.findOne({user_id:id},function(error,result){
       if(error) throw error;
            console.log(result)
        arr=result.data;
        j=find(arr,data.id);
        result.data.splice(j,1);
      result.save(function(err){
          if(err) throw err;
          return response.send();
      });
     });
    }
}
//---------------------------------------------------------------------------------------------PLACEORDER

function placeOrder(header,response)
{
    id=header._id;
    cartproducts.findOne({user_id:id},function(err,result){
        if(err) throw err;
        order=new orders({_id:new mongoose.Types.ObjectId(),user_id:id,username:header.name,email:header.email,address:"chandigarh",   created:Date.now(),status:0,data:result.data});
        order.save(function(error){
            if(error) throw error;
            storeforClientView(header,result,order,response);
        });
      });
}

function storeforClientView(header,result,order,response)
{
    clientorder=new clientorders({
        _id:new mongoose.Types.ObjectId(),user_id:header._id,order_id:order._id,created:Date.now(),status:0,data:result.data
    });
    clientorder.save(function(err){
       //..............................reduce in products wala function....................... populate learn
        deleteFromCart(header,{id:-1},response);
    });
}

function showClientOrders(header,response)
{
    
}
//----------------------------------------------------------------------------------------------ADMIN WORK

function getOrders(callback)
{
    orders.find({},{_id:1,status:1,address:1,created:1,updated:1},function(error,result){
        callback(result);
    });
}

function get_OpenedOrder_Detail(orderid,callback)
{
    console.log('detail '+orderid);
    orders.findOne({_id:orderid},function(error,result){
        callback(result);
     });
}

function removeOrder(orderid,callback)
{
    orders.findOneAndRemove({_id:orderid},function(err,result){
        if(err) throw err;
        
        clientorders.findOneAndUpdate({order_id:data.orderid},{$set:{status:7,updated:Date.now()}},function(error,result){  //7=cancelled
        if(error) throw err;
            
        callback();
      });
    });
}

function updateOrder(data,callback)
{
    orders.findOneAndUpdate({_id:data.orderid},{$set:{status:data.status,updated:Date.now()}},function(err,result){
        if(err) throw err;
        
        clientorders.findOneAndUpdate({order_id:data.orderid},{$set:{status:data.status,updated:Date.now()}},function(error,result){
        if(error) throw err;
            
         callback();
       });
    });
}


function getParticularProducts(activeaccount,file1,file2,response)      //file1 is products and file2=cartproducts
{
   readInfo(file1,function(products){
       var data=[];
       readInfo(file2,function(info){
           cart=[];
           index=cart_ofActivePerson(info,activeaccount);
           if(index!=-1)
              cart=info[index].data;
           for (var j=0;j<cart.length;j++)
              {
                  for(var i=0;i<products.length;i++)
                      {
                          if(cart[j].id===products[i].id)
                              data.push(products[i]);
                      }
              }
           response.send(JSON.stringify(data));
       });
   });
}


function reduceParticularProducts(data,file,response)
{
    readInfo(file,function(products){
        for(var j=0;j<data.length;j++)
        {
            for(var i=0;i<products.length;i++)
            {
                if(data[j].id===products[i].id)
                {
                    products[i].quantity=data[j].quantity;
                }
            }
        }
        writeInfo(file,products,function(){
            response.send(JSON.stringify(true));
        });
    });
}
   

function increaseOrderid(file,callback)
{
    readInfo(file,function(orderid){
        orderid+=1;
        writeInfo(file,orderid,callback); 
    });
}

 
function addItems(obj,file,callback)    //like adding ordrs and ordersdetails are using this function
{
    readInfo(file,function(info){
        info.push(obj);
        writeInfo(file,info,callback);
    });
}


function storeclientorder_forview(obj,file,response)
{
    readInfo(file,function(info){
        var index=cart_ofActivePerson(info,obj.email);
        console.log("index="+index);
        if(index===-1)
          info.push(obj);
        else
           {
               info[index].data=info[index].data.concat(obj.data)
           }
        writeInfo(file,info,function(){
            response.send(JSON.stringify(true));
        });
    });
}


function getclientorders_forview(activeaccount,file,response)
{
    readInfo(file,function(info){
        data=[];
        var index=cart_ofActivePerson(info,activeaccount);
        if(index!=-1)
           {
               data=info[index].data;
               console.log(data);
           }
            response.send(JSON.stringify(data));
    });
}


function changeOrderStatus(data,file,response)
{
    readInfo(file,function(info){
        for(var j=0;j<info.length;j++)
            {
                if(info[j].orderid===data.orderid)
                    {
                        info[j].status=data.status;
                        break;
                    }
            }
        writeInfo(file,info,function(){
            response.send(JSON.stringify(true));
        });
    });
}
 

function removeOrder_and_detail(orderid,file1,file2,response)
{
    readInfo(file1,function(info1){
        readInfo(file2,function(info2){
               for(var j=0;j<info1.length;j++)
                {
                    if(info1[j].orderid===orderid)
                        {
                            info1.splice(j,1);
                            info2.splice(j,1);
                            break;
                        }
                }
            writeInfo(file1,info1,function(){
                writeInfo(file2,info2,function(){
                    response.send(JSON.stringify(true));
                });
            }); 
        });
    });
}





//========================================================================================
//----------------------------------------------------------------------------------------GET


            
                routes.get('/',function(request,response){
                    console.log('inside /')
                    response.sendFile(path.join(__dirname+'/public/start.html'));
                });
            
            
             routes.get('/products/getproducts',function(request,response){
                   getProducts(function(products){
                        response.send(JSON.stringify(products));
                   });
               }); 
            
    
            routes.get("/cartproducts/getcartproducts",function(request,response){
                console.log(request.session.header)
                    getCartProducts(request.session.header,function(cartproducts){
                        response.send(JSON.stringify(cartproducts));
                   });
                });
    
    
            routes.get("/placeorder",function(request,response){
                    console.log("enteted placing");
                    placeOrder(request.session.header,response);
                });


            routes.get("/admin/getorders",function(request,response){
                console.log('in orders')
                   getOrders(function(data){
                       response.send(data);
                   });
                });
            
             routes.get("/admin/get_openedorder_detail",function(request,response){
                 console.log('entered in detail')
                    get_OpenedOrder_Detail(request.session.orderid,function(data){
                       response.send(data);
                   });
                });

            
            routes.get("/getactiveuser",checkLoggedIn,function(request,response){
                response.send(JSON.stringify(request.session.header.name));
            })

            routes.get("/logout",checkLoggedIn,function(request,response){
                console.log('in lgout')
                response.sendFile(path.join(__dirname+'/public/start.html'));
            })
        
            
            
//---------------------------------------------------------------------------------------------POST

               routes.post("/addaccount",function(request,response){
                   console.log('entered signup')
                 account=request.body;
                   createAccount(account,function() {
                    response.send();
                });
            });
               
            
             routes.post("/checkLOGIN",function(request,response){ 
                   data=request.body;
                       console.log(data.email);
                       checkSignin(data,function(result,flag){
                           if(flag==true){
                               request.session.isLoggedIn=true;
                               request.session.header={
                                   name:result.name,
                                   email:result.email,
                                   _id:result._id
                               }
                               console.log(request.session.header)
                           }
                          return response.send(JSON.stringify(flag)); 
                       });
                });
            
             routes.post("/checkSIGNUP",function(request,response){
                     console.log('entered signupcheck')
                   data=request.body;
                 console.log('data  is');
                   console.log(data);
                    checkExistingUserforSignup(data,function(flag){
                          return response.send(JSON.stringify(flag)); 
                       });
                });
            
            
            routes.post("/products/addproduct",function(request,response){  //uploadImage.single('image'),
                    console.log("entered add product");
                   data=request.body;
                       console.log(data);
                //console.log(request.file.filename)
                       storeProducts(data,function(data){                   //request.file.filename,
                          return response.send(JSON.stringify(data)); 
                       });
                });
            
            routes.post("/products/deleteproduct",function(request,response){
                    console.log("enteted");
                   data=request.body._id;
                    console.log(data);
                    deleteProducts(data,function(){ 
                           response.send();
                });
            });
            
            routes.post("/products/updateproduct",function(request,response){
                    console.log("enteted");
                   data=request.body;
                       console.log(data);
                       updateProducts(data,function(){
                           response.send();
                       });
                });
            
            
            
            routes.post("/cartproducts/addproduct",checkLoggedIn,function(request,response){
                    console.log("entered add product");
                   data=request.body;
                       console.log(data);
                console.log(request.session.header);
                       addOrUpdateCart(request.session.header,data,response);
                });
            
            routes.post("/cartproducts/deletecartproduct",function(request,response){
                    console.log("enteted");
                   data=request.body;
                       console.log(data);
                       deleteFromCart(request.session.header,data,response);
                });
            
            routes.post("/cartproducts/updatecartproduct",function(request,response){
                   data=request.body;
                       console.log(data);
                       addOrUpdateCart(request.session.header,data,response);
                });

            routes.post("/updatecartproduct_from_displaycartpage",function(request,response){
                   data=request.body;
                       console.log(data);
                       updateCart(data,'files/cartproducts',response);
                });
            
            routes.post('/admin/openorderdetail',function(request,response){
                console.log('order to open'+request.body.orderid)
                request.session.orderid=request.body.orderid;
                   response.send();
            });
    
    
            routes.post('/admin/removeorder',function(request,response){
                 data=request.body;
                 removeOrder(data.orderid,function(){
                     response.send();
                 });
             });
            
            routes.post('/admin/changeorderstatus',function(request,response){
               data=request.body;
                console.log('update ')
                console.log(data)
                updateOrder(data,function(){
                    response.send();
                });
            });
            
    
    
    
            routes.post("/storeorderdetails",function(request,response){
                  data=request.body;
                       addItems(data,'files/ordersdetails' ,function() {
                       response.send(JSON.stringify(true));
                       });
                  });
            
              routes.post("/reduceinproducts_correspondingtoCart",function(request,response){
                   data=request.body;
                       reduceParticularProducts(data,'files/products',response);
                });
            
             routes.post("/getclientorders_forview",function(request,response){
                   data=request.body.acc;
                       getclientorders_forview(data,'files/placed_ordersfor_client_view',response);
                });
            
            routes.post("/storeclientorder_forview",function(request,response){
                  data=request.body;
                       storeclientorder_forview(data,'files/placed_ordersfor_client_view',response);
                });
            
             routes.post("/changeorderstatus",function(request,response){
                   data=request.body;
                       changeOrderStatus(data,'files/orders',response);
                });
            
            routes.post("/removeorder",function(request,response){
                  data=request.body.orderid;
                       removeOrder_and_detail(data,'files/orders','files/ordersdetails',response);
                });
            
 



        module.exports = routes;
