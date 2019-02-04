var express=require('express')
var routes = require('./routes'); 
//var fs = require('fs');
//var path=require('path')
//var bodyparser=require('body-parser')

var app=express();

app.set('port',process.env.PORT||8000)
const port=app.get('port');

app.use('/', routes); 

/*app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}))
app.use( express.static(__dirname+'/public' ));

function readAndServe(path,contentType,response)
{
    fs.readFile(path,function(error,data)
               {
        if(error)
            {
                throw error;
            }
        response.send(JSON.stringify(data));
    });
}

function readInfo(file,callback)
{
    fs.readFile(file,function(error,contents){
        if(error)
            {
                throw error;
            }
        
        var info;
        if(contents.length===0)
            info=[];
        else
            {
                info=JSON.parse(contents);
            }
        callback(info);
    });
}


function writeInfo(file,info,callback)
{
    console.log(info);
    var infoJSON=JSON.stringify(info);
    fs.writeFile(file,infoJSON,function(error){
        if(error)
            throw error;
        
        callback();
        
    });
} 

function createAccount(obj,file,callback)
{
    readInfo(file,function(info){
        info.push(obj);
        writeInfo(file,info,callback);
    });
}


function checkAccount(data,file,flag,response)
{
    if(flag==="checkForSignin")
    {
            readInfo(file,function(accounts){
            name=false;
            console.log(data.email);
           for(var j=0;j<accounts.length;j++)
               {
                   console.log(accounts[j].email+" "+accounts[j].name);
                   if(accounts[j].email===data.email && accounts[j].password===data.password)
                       {
                           name=accounts[j].name;
                           break;
                       }
               }
            response.send(JSON.stringify(name));
        });
    }
    else if(flag==="checkForSignup")
        {
                readInfo(file,function(accounts){
                flag=true;
                console.log(data);
               for(var j=0;j<accounts.length;j++)
                   {
                       console.log(accounts[j].email+" "+accounts[j].name);
                       if(accounts[j].email===data)
                           {
                               flag=false;
                               break;
                           }
                   }
                response.send(JSON.stringify(flag));
            });
        }
}



function workOnProducts(data,file,flag,response)
{
console.log("work");
    console.log(flag);
            readInfo(file,function(products){
                
                if(flag==="add")
                {
                    products.push(data);
                }
                
                else if(flag==="delete")
                 {
                    for(var j=0;j<products.length;j++)
                    {
                        if(products[j].id===data)   // here in this case id was sent as data from script file
                            {
                                products.splice(j,1);
                                break;
                            }
                    } 
                 }
                
                else if(flag==="update")
                {
                    for(var j=0;j<products.length;j++)
                    {
                        if(products[j].id===data.id)
                            {
                                products[j]=data;
                                break;
                            }
                    }    
                }
                
                writeInfo(file,products,function(){
                    response.send(JSON.stringify(true));
                });
            });
         
}


function getStoredCartProducts(activeaccount,file,response)
{
    console.log(activeaccount);
    readInfo(file,function(info){
        var index=-1;
        var cart=[];
        if(info.length!=0)
          index=cart_ofActivePerson(info,activeaccount);
        if(index!=-1)
          cart=info[index].data;
 
        readInfo('files/products',function(products){
                  var length1=cart.length;
                console.log(length1);
                  var flag=0;
              for(var j=cart.length-1;j>=0;j--)
                  {
                      flag=0;
                      for(var i=0;i<products.length;i++)
                          {
                              if(cart[j].id==products[i].id)
                                  {
                                      flag=1;
                                      break;
                                  }
                          }
                      if(flag===0)
                      {
                          console.log("splicing "+j);
                          cart.splice(j,1 );
                      }
                  }
                  var length2=cart.length;
                console.log(length2);
                  if(length2<length1)
                      {
                          writeInfo(file,info,function(){
                            response.send(JSON.stringify(cart));
                          });
                      }
                    else
                    {
                        response.send(JSON.stringify(cart));
                    }
        });
    });
}

function cart_ofActivePerson(info,activeaccount)
{
    console.log("finding index for="+activeaccount);
    for(j=0;j<info.length;j++)
        {
            if(info[j].email===activeaccount)
                return j;
        }
    return -1;
}


function workOnCart(ob,file,flag,response)
{
    readInfo(file,function(info){
        var index=-1;
        var cart=[];
        if(info.length!=0)
          index=cart_ofActivePerson(info,ob.activeaccount);
        console.log("index="+index);
        if(flag==="add")
            {
                console.log("in add");
                if(index===-1)  //info.length==0 
                    {
                        info.push({email:ob.activeaccount,data:[ob.data]});
                    }
                else
                   {
                       cart=info[index].data;
                       cart.push(ob.data);
                   }
                
            }
        else if(flag==="update")
            {
                cart=info[index].data;
                for(var j=0;j<cart.length;j++)
                   {
                       if(cart[j].id===ob.data.id)
                           {
                               cart[j].cquantity+=ob.data.cquantity;
                               //cart[j]=ob.pdt;
                           }
                   }
                
            }
        else if(flag==="delete") // delete only activeaccount and id is send in object
            {
                cart=info[index].data;
                if(ob.id=== -1)       // means if -1 is send is send as id it means to remove cart of that account.
                    {
                        info.splice(index,1);
                    }
                else
                    {
                        for(var j=0;j<cart.length;j++)
                            {
                                if(cart[j].id===ob.id)
                                    {
                                        cart.splice(j,1);
                                        if(cart.length===0)
                                            info.splice(index,1);
                                        break;
                                    }
                            }
                    }
            }
        
        writeInfo(file,info,function(){
                    response.send(JSON.stringify(true));
                });
    });   
}

function updateCart(ob,file,response)
{
    readInfo(file,function(info){
        var cart=[];
        if(info.length!=0)
          index=cart_ofActivePerson(info,ob.activeaccount);
        console.log("index="+index);
        
        cart=info[index].data;
                for(var j=0;j<cart.length;j++)
                   {
                       if(cart[j].id===ob.data.id)
                           {
                               cart[j].cquantity=ob.data.cquantity;
                           }
                   }
        writeInfo(file,info,function(){
                    response.send(JSON.stringify(true));
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

function get_OpenedOrder_Detail(orderid,file,response)
{
    readInfo(file,function(info){
        var j;
        for( j=0;j<info.length;j++)
            {
                if(info[j].orderid===orderid)
                    break;
            }
        response.send(JSON.stringify(info[j]));
    });
}



//========================================================================================
//----------------------------------------------------------------------------------------GET


            
                app.get('/',function(request,response){
                    response.sendFile(path.join(__dirname+'/public/choose.html'));
                });
            
            
             app.get('/getproducts',function(request,response){
                   readInfo('files/products',function(info){
                       response.send(JSON.stringify(info));
                   });
               }); 
            
            app.get("/getorderid",function(request,response){
                   readInfo('files/nextorderid',function(info){
                       response.send(JSON.stringify(info));
                   });
                });
            
            app.get("/getorders",function(request,response){
                   readInfo('files/orders',function(info){
                       response.send(JSON.stringify(info));
                   });
                });
            
        
//---------------------------------------------------------------------------------------------POST

               app.post("/adduseraccount",function(request,response){
                 account=request.body;
                   createAccount(account,'files/useraccounts' ,function() {
                    response.send();
                });
            });
               
                app.post("/addadminaccount",function(request,response){ 
                  account=request.body;
                   createAccount(account,'files/adminaccounts' ,function() {
                    response.send();
                });
            });
            
             app.post("/checkLOGINuseraccounts",function(request,response){
                    console.log("entered login");
                   data=request.body;
                       console.log(data.email);
                       checkAccount(data,'files/useraccounts',"checkForSignin",response);
                });
            
             app.post("/checkSIGNUPuseraccounts",function(request,response){
                    console.log("enteted");
                   data=request.body.email;
                       console.log(data);
                       checkAccount(data,'files/useraccounts',"checkForSignup",response);
                });
            
            app.post("/checkLOGINadminaccounts",function(request,response){
                    console.log("entered");
                   data=request.body;
                       console.log(data.email);
                       checkAccount(data,'files/adminaccounts',"checkForSignin",response);
                });
            
            app.post("/checkSIGNUPadminaccounts",function(request,response){
                    console.log("enteted");
                   data=request.body.email;
                       console.log(data);
                       checkAccount(data,'files/adminaccounts',"checkForSignup",response);
                });
            
            app.post("/addproduct",function(request,response){
                    console.log("entered add product");
                   data=request.body;
                       console.log(data);
                       workOnProducts(data,'files/products',"add",response);
                });
            
            app.post("/deleteproduct",function(request,response){
                    console.log("enteted");
                   data=request.body.id;
                       console.log(data);
                       workOnProducts(data,'files/products',"delete",response);
                });
            
            app.post("/updateproduct",function(request,response){
                    console.log("enteted");
                   data=request.body;
                       console.log(data);
                       workOnProducts(data,'files/products',"update",response);
                });
            
            app.post("/getcartproducts",function(request,response){
                    data=request.body.acc;
                        getStoredCartProducts(data,'files/cartproducts',response);
                });
            
            app.post("/addcartproduct",function(request,response){
                    console.log("entered add product");
                   data=request.body;
                       console.log(data);
                       workOnCart(data,'files/cartproducts',"add",response);
                });
            
            app.post("/deletecartproduct",function(request,response){
                    console.log("enteted");
                   data=request.body;
                       console.log(data);
                       workOnCart(data,'files/cartproducts',"delete",response);
                });
            
            app.post("/updatecartproduct",function(request,response){
                   data=request.body;
                       console.log(data);
                       workOnCart(data,'files/cartproducts',"update",response);
                });

            app.post("/updatecartproduct_from_displaycartpage",function(request,response){
                   data=request.body;
                       console.log(data);
                       updateCart(data,'files/cartproducts',response);
                });
            
            
              
            app.post("/getproducts_corespondingtoCart",function(request,response){
                   data=request.body.acc;
                       console.log(data);
                       getParticularProducts(data,"files/products","files/cartproducts",response);
                });
            
            
            app.post("/placeorder",function(request,response){
                    data=request.body;
                        addItems(data,'files/orders' ,function() {
                            increaseOrderid('files/nextorderid',function(){
                                response.send(JSON.stringify(true));
                            });
                        });
                  });
            
            app.post("/storeorderdetails",function(request,response){
                  data=request.body;
                       addItems(data,'files/ordersdetails' ,function() {
                               response.send(JSON.stringify(true));
                       });
                  });
            
              app.post("/reduceinproducts_correspondingtoCart",function(request,response){
                   data=request.body;
                       reduceParticularProducts(data,'files/products',response);
                });
            
             app.post("/getclientorders_forview",function(request,response){
                   data=request.body.acc;
                       getclientorders_forview(data,'files/placed_ordersfor_client_view',response);
                });
            
            app.post("/storeclientorder_forview",function(request,response){
                  data=request.body;
                       storeclientorder_forview(data,'files/placed_ordersfor_client_view',response);
                });
            
             app.post("/changeorderstatus",function(request,response){
                   data=request.body;
                       changeOrderStatus(data,'files/orders',response);
                });
            
            app.post("/removeorder",function(request,response){
                  data=request.body.orderid;
                       removeOrder_and_detail(data,'files/orders','files/ordersdetails',response);
                });
            
            app.post("/get_openedorder_detail",function(request,response){
                   data=request.body.orderid;
                       console.log(data);
                       get_OpenedOrder_Detail(data,"files/ordersdetails",response);
                });*/

            



app.listen(port,function(err)
             {
    if(err)
        {
            return console.log("something bad happened "+err);
        }
    console.log('server is listening on '+port);
    
});