
var http = require('http');
var url = require('url');
var fs = require('fs');
var S=require('string');

const port=8000;


function readAndServe(path,contentType,response)
{
    fs.readFile(path,function(error,data)
               {
        if(error)
            {
                throw error;
            }
        response.writeHead(200,{'content-type':contentType});
        response.write(data);
        response.end();
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
            response.writeHead(200,{'Content-type':'application/json'});
            response.write(JSON.stringify(name));
            response.end();
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
                response.writeHead(200,{'Content-type':'application/json'});
                response.write(JSON.stringify(flag));
                response.end();
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
                    response.writeHead(200,{'Content-type':'application/json'})
                    response.write(JSON.stringify(true));
                    response.end();
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
 
        readInfo('products',function(products){
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
                            response.writeHead(200,{'Content-type':'application/json'})
                            response.write(JSON.stringify(cart));
                            response.end();
                          });
                      }
                    else
                    {
                        response.writeHead(200,{'Content-type':'application/json'})
                        response.write(JSON.stringify(cart));
                        response.end();
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
                    response.writeHead(200,{'Content-type':'application/json'})
                    response.write(JSON.stringify(true));
                    response.end();
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
           response.writeHead(200,{'Content-type':'application/json'})
           response.write(JSON.stringify(data));
           response.end();
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
            response.writeHead(200,{'Content-type':'application/json'})
            response.write(JSON.stringify(true));
            response.end();
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
            response.writeHead(200,{'Content-type':'application/json'})
            response.write(JSON.stringify(true)) ;
            response.end();
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
            response.writeHead(200,{'Content-type':'application/json'})
            response.write(JSON.stringify(data)) ;
            response.end();
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
            response.writeHead(200,{'Content-type':'application/json'})
            response.write(JSON.stringify(true));
            response.end();
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
                    response.writeHead(200,{'Content-type':'application/json'})
                    response.write(JSON.stringify(true));
                    response.end();
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
        response.writeHead(200,{'Content-type':'application/json'})
        response.write(JSON.stringify(info[j]));
        response.end();
    });
}

function readJSONBody(request, callback) 
{
     
  var body = '';
  request.on('data', function(chunk) {
					 body += chunk;
			});

  request.on('end', function() {
					var data = JSON.parse(body);
					callback(data);
		   });
}


const requestHandler=function(request,response)
{
    
    var pathname=url.parse(request.url).pathname;
    
    console.log(pathname);
    flag=(S(pathname).includes(".html"));
    console.log(flag);
    
    if(request.method === "GET")
        {
            if(pathname==="/")
                readAndServe('choose.html','text/html',response);
            else if((S(pathname).includes(".html"))===true)
                {
                    //response.end('fond');
                    readAndServe('.'+pathname,'text/html',response);
                }
            else if((S(pathname).includes(".css"))===true)
                {
                    //response.end('fond');
                    readAndServe('.'+pathname,'text/css',response);
                }
            else if((S(pathname).includes(".js"))===true)
                {
                    //response.end('fond');
                     readAndServe('.'+pathname,'text/javascript',response);
                }
            else if((S(pathname).includes(".png"))===true)
                {
                    //response.end('fond');
                    readAndServe('.'+pathname,'image/png',response);
                }
            
            
             else if(pathname==="/getproducts")
                {
                   readInfo('products',function(info){
                       response.writeHead(200,{'Content-type':'application/json'});
                        response.write(JSON.stringify(info));
                        response.end();
                   });
                }
            
            else if(pathname==="/getorderid")
                {
                   readInfo('nextorderid',function(info){
                       response.writeHead(200,{'Content-type':'application/json'});
                        response.write(JSON.stringify(info));
                        response.end();
                   });
                }
            
            else if(pathname==="/getorders")
                {
                   readInfo('orders',function(info){
                       response.writeHead(200,{'Content-type':'application/json'});
                        response.write(JSON.stringify(info));
                        response.end();
                   });
                }
            
        
            else
               response.end('page not found');
        }
    
    else if(request.method=="POST")
        {
               if (pathname === "/adduseraccount") 
               {
                 readJSONBody(request, function(account) {
                   createAccount(account,'useraccounts' ,function() {
             // must wait until task is stored before returning response
                  response.end();
                });
              });
            }
               
                else if (pathname === "/addadminaccount") 
               {
                 readJSONBody(request, function(account) {
                   createAccount(account,'adminaccounts' ,function() {
             // must wait until task is stored before returning response
                  response.end();
                });
              });
            }
            
             else if(pathname==="/checkLOGINuseraccounts")
                {
                    console.log("entered");
                   readJSONBody(request,function(data){
                       console.log(data.email);
                       checkAccount(data,'useraccounts',"checkForSignin",response);
                   });
                }
            
             else if(pathname==="/checkSIGNUPuseraccounts")
                {
                    console.log("enteted");
                   readJSONBody(request,function(data){
                       console.log(data);
                       checkAccount(data,'useraccounts',"checkForSignup",response);
                   });
                }
            
            else if(pathname==="/checkLOGINadminaccounts")
                {
                    console.log("entered");
                   readJSONBody(request,function(data){
                       console.log(data.email);
                       checkAccount(data,'adminaccounts',"checkForSignin",response);
                   });
                }
            
            else if(pathname==="/checkSIGNUPadminaccounts")
                {
                    console.log("enteted");
                   readJSONBody(request,function(data){
                       console.log(data);
                       checkAccount(data,'adminaccounts',"checkForSignup",response);
                   });
                }
            
            else if(pathname==="/addproduct")
                {
                    console.log("entered add product");
                   readJSONBody(request,function(data){
                       console.log(data);
                       workOnProducts(data,'products',"add",response);
                   });
                }
            
            else if(pathname==="/deleteproduct")
                {
                    console.log("enteted");
                   readJSONBody(request,function(data){
                       console.log(data);
                       workOnProducts(data,'products',"delete",response);
                   });
                }
            
            else if(pathname==="/updateproduct")
                {
                    console.log("enteted");
                   readJSONBody(request,function(data){
                       console.log(data);
                       workOnProducts(data,'products',"update",response);
                   });
                }
            
            else if(pathname==="/getcartproducts")
                {
                    readJSONBody(request,function(data){
                        getStoredCartProducts(data,'cartproducts',response);
                    });
                }
            
            else if(pathname==="/addcartproduct")
                {
                    console.log("entered add product");
                   readJSONBody(request,function(data){
                       console.log(data);
                       workOnCart(data,'cartproducts',"add",response);
                   });
                }
            
            else if(pathname==="/deletecartproduct")
                {
                    console.log("enteted");
                   readJSONBody(request,function(data){
                       console.log(data);
                       workOnCart(data,'cartproducts',"delete",response);
                   });
                }
            
            else if(pathname==="/updatecartproduct")
                {
                   readJSONBody(request,function(data){
                       console.log(data);
                       workOnCart(data,'cartproducts',"update",response);
                   });
                }
            
            
              
            else if(pathname==="/getproducts_corespondingtoCart")
                {
                   readJSONBody(request,function(data){
                       console.log(data);
                       getParticularProducts(data,"products","cartproducts",response);
                   });
                }
            
            
            else if(pathname==="/placeorder")
                {
                    readJSONBody(request, function(data) {
                        addItems(data,'orders' ,function() {
                            increaseOrderid('nextorderid',function(){
                                response.writeHead(200,{'Content-type':'application/json'});
                                response.write(JSON.stringify(true));
                                response.end();
                            });
                        });
                    });
                }
            
            else if(pathname==="/storeorderdetails")
                {
                  readJSONBody(request, function(data) {
                       addItems(data,'ordersdetails' ,function() {
                               response.writeHead(200,{'Content-type':'application/json'});
                               response.write(JSON.stringify(true));
                               response.end();
                       });
                   });
                }
            
              else if(pathname==="/reduceinproducts_correspondingtoCart")
                {
                   readJSONBody(request,function(data){
                       reduceParticularProducts(data,'products',response);
                   });
                }
            
             else if(pathname==="/getclientorders_forview"  )
                {
                   readJSONBody(request,function(data) {
                       getclientorders_forview(data,'placed_ordersfor_client_view',response);
                   });
                }
            
            else if(pathname==="/storeclientorder_forview"  )
                {
                   readJSONBody(request,function(data) {
                       storeclientorder_forview(data,'placed_ordersfor_client_view',response);
                   });
                }
            
             else if(pathname==="/changeorderstatus")
                {
                   readJSONBody(request,function(data){
                       changeOrderStatus(data,'orders',response);
                   });
                }
            
            else if(pathname==="/removeorder")
                {
                   readJSONBody(request,function(data){
                       removeOrder_and_detail(data,'orders','ordersdetails',response);
                   });
                }
            
            else if(pathname==="/get_openedorder_detail")
                {
                   readJSONBody(request,function(data){
                       console.log(data);
                       get_OpenedOrder_Detail(data,"ordersdetails",response);
                   });
                }
            
            
            else
               response.end('unsuccesful');
    }
            
}

const server=http.createServer(requestHandler);

server.listen(port,function(err)
             {
    if(err)
        {
            return console.log("something bad happened "+err);
        }
    console.log('server is listening on '+port);
    
});