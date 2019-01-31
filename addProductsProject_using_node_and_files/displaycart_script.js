var nn=document.getElementById("welcome");
var active_account=getactiveaccount();
nn.textContent="hi "+active_account.name+"!";
var account=active_account.email;

function getactiveaccount()
{
if (!sessionStorage.active_account)
{
     alert("session expired.login to continue");
       document.location.href = "account.html";
}

return JSON.parse(sessionStorage.active_account);
}

var orderid;
getStoredLastOrderid();
function getStoredLastOrderid()
{
    var request = new XMLHttpRequest();
  
   request.addEventListener('load', function() 
  {
    if (request.status === STATUS_OK) {
      orderid = JSON.parse(request.responseText);
        //alert(orderid);
    }
  });
  
  request.open("GET", '/getorderid');
  request.send();
}



////creating side bar of logout and viewcart option
make_sidebar();
function make_sidebar()
{
var side=document.getElementById("side_bar_div");
var logoutbtn=document.createElement("button");
var addmorebtn=document.createElement("button");
var view_ordersbtn=document.createElement("button");
    
logoutbtn.textContent="Logout";
addmorebtn.textContent="order products";
view_ordersbtn.textContent="view orders";
    
logoutbtn.setAttribute("style","background-color:red;padding:8px 18px;color:white;border-radius:3px;margin-top:10px;margin-left:10px");
side.appendChild(logoutbtn);
var breakLine=document.createElement("br");
    side.appendChild(breakLine);
var breakLine=document.createElement("br");
    side.appendChild(breakLine);
    
addmorebtn.setAttribute("style","background-color:blue;padding:10px 10px;color:white;border-radius:3px;margin-top:10px;margin-left:10px;margin-right:10px");
side.appendChild(addmorebtn);
var breakLine=document.createElement("br");
    side.appendChild(breakLine);
var breakLine=document.createElement("br");
    side.appendChild(breakLine);

view_ordersbtn.setAttribute("style","background-color:darkgreen;padding:10px 10px;color:white;border-radius:3px;margin-top:10px;margin-left:10px;margin-right:10px");
side.appendChild(view_ordersbtn);
    
    
    logoutbtn.addEventListener("click", function(event) 
    {
        flag=confirm("do you want to logout");
        if(flag==true)
            {
        sessionStorage.removeItem("active_account");
        document.location.href = "account.html";
            }
    });
    
     addmorebtn.addEventListener("click", function(event) 
    {
        document.location.href = "product_list.html";
            
    });
    
      view_ordersbtn.addEventListener("click", function(event) 
    {
        document.location.href = "viewplacedorders.html";
            
    });
}

//////////////




var total=0;
var products=[];
var cartproducts=[];
var ordered_data=[];

var STATUS_OK=200;

getParticularStoredProducts();
getStoredCartProducts();

function getStoredCartProducts()
{
  var request = new XMLHttpRequest();
  
   request.addEventListener('load', function() 
  {
    if (request.status === STATUS_OK) {
       cartproducts = JSON.parse(request.responseText);
            //alert(cartproducts.length);
      start();
    }
  });

  request.open("POST", '/getcartproducts');
  request.send(JSON.stringify(account));
}


function start()
{
    //alert("products in start="+products.length);
    if(cartproducts.length!=0)
    {
        var btn=document.getElementById("btn_checkout");
        btn.setAttribute("style","margin-left:150px;display:block;padding:8px 16px;background-color: #4CAF50;color:white;margin-bottom: 10px;")
    
    for(var j=0;j<cartproducts.length;j++)
        {
            show_in_cart(cartproducts[j]);
        }
    }
}


function getParticularStoredProducts()
{
     var request = new XMLHttpRequest();
  
   request.addEventListener('load', function() 
  {
    if (request.status === STATUS_OK) {
      products = JSON.parse(request.responseText);
    }
  });
  
  request.open("POST", '/getproducts_corespondingtoCart');
   request.send(JSON.stringify(account));
}



function show_in_cart(pdt)
{
    //alert("bc");
    var cart=document.getElementById("div_cart");
    var checkout=document.getElementById("btn_checkout");
    var pdtdiv=document.createElement("div");
    var labelname=document.createElement("label");
    var labelprice=document.createElement("label");
    var labelquantity=document.createElement("label");
    var dropdown=document.createElement("select");
    var labelTotal=document.createElement("label");
    var Totaltag=document.createElement("label");
    var quantitytag=document.createElement("label");
    var horizontal=document.createElement("hr");  
    var remove=document.createElement("button");
    
    
    labelname.setAttribute("style", "float: left; margin-left:10px;");
    labelprice.setAttribute("style", "float: right; margin-right:10px;margin-top:3px");
    pdtdiv.appendChild(labelname);
    pdtdiv.appendChild(labelprice);
    var breakLine=document.createElement("br");
    breakLine.setAttribute("style","clear:both");
    pdtdiv.appendChild(breakLine);
      
    quantitytag.setAttribute("style", "float: left; margin-left:10px");
    dropdown.setAttribute("style","margin-left:10px;float:left;background-color:dimgray;color:white;padding 7 px 10px;width:50px");
    dropdown.setAttribute("id",pdt.id);
    labelquantity.setAttribute("style", "float: right; margin-right:10px;margin-top:3px");
    labelquantity.setAttribute("class",pdt.id);
    pdtdiv.appendChild(quantitytag);
    pdtdiv.appendChild(dropdown);
    pdtdiv.appendChild(labelquantity);
    var breakLine=document.createElement("br");
    breakLine.setAttribute("style","clear:both");
    pdtdiv.appendChild(breakLine);
   
    
    Totaltag.setAttribute("style", "float: left; margin-left:10px");
    labelTotal.setAttribute("style", "float: right; margin-right:10px;margin-top:3px");
    labelTotal.setAttribute("class",pdt.id);
    pdtdiv.appendChild(Totaltag);
    pdtdiv.appendChild(labelTotal);
    var breakLine=document.createElement("br");
    breakLine.setAttribute("style","clear:both");
    pdtdiv.appendChild(breakLine);
    
    
    remove.setAttribute("style", "float: left; margin-left:10px;background-color:crimson;color:white;padding:3px 8px;border-radius:5px");
    pdtdiv.appendChild(remove);
    var breakLine=document.createElement("br");
    breakLine.setAttribute("style","clear:both");
    pdtdiv.appendChild(breakLine);    
    
    var j;
    for(j=0;j<products.length;j++)
        {
            if(products[j].id==pdt.id)
                break;
        }
    var obj={
             name:products[j].name,
             cquantity:pdt.cquantity,
             price:products[j].price
            }; 
    ordered_data.push(obj);
    
    pdtdiv.appendChild(horizontal);
    labelname.textContent=products[j].name;
    labelprice.textContent="Rs "+products[j].price;
    quantitytag.textContent="Quantuty:";
    addindropdown(dropdown,products[j].quantity,pdt.cquantity);
    dropdown.value=parseInt(pdt.cquantity);
    labelquantity.textContent="x"+pdt.cquantity;
    Totaltag.textContent="Total:";
//alert("prev"+total);
    var pr=parseInt(pdt.cquantity)*parseInt(products[j].price)
    total=total+pr;
   // alert("new"+total);
    labelTotal.textContent=pr;
    remove.textContent="remove";
    
    checkout.innerHTML="SUBTOTAL: Rs."+total+"<br><hr>CHECKOUT";
    
    cart.insertBefore(pdtdiv,checkout);
    
   remove.addEventListener("click", function(event) 
    {
    //alert("flag="+flag);
    remove_fun(pdt.id,remove);
    });
    
   dropdown.addEventListener("change", function(event) 
    {
    //alert(dropdown.value);
    update_cartquantity(pdt.id,pdt.cquantity,dropdown.value);
    });
        
    
}

function addindropdown(dropdown,total,cartquan)
{
    var end=10;
    if(parseInt(total)<10)
        end=parseInt(total);
    for(var j=1;j<=end;j++)
        {
           var op=document.createElement("option");
           op.text=j;
           dropdown.appendChild(op);
        }
}

function remove_fun(id,removebtn)
{
    var parent=removebtn.parentNode;
    
    while(parent.firstChild)
        {
            parent.removeChild(parent.firstChild);
        }
    parent.parentNode.removeChild(parent);
    
    
     deleteStoredCartProducts(id,function(){
         
         for(var j=0;j<cartproducts.length;j++)
          {
              if(cartproducts[j].id==id)
                  {
                      cartproducts.splice(j,1);
                      break;
                  }
          }
    
         if(cartproducts.length==0)
          {
              btn=document.getElementById("btn_checkout");
              btn.style.display="none";
          }
     });
     
}

function deleteStoredCartProducts(id,callback)
{
        var request=new XMLHttpRequest();
     request.addEventListener('load', function() 
	  {
		if (request.status === STATUS_OK) {
			 flag=JSON.parse(request.responseText);
            if(flag==true)
		     callback();
            else
                alert("deletion failed");
		}
	  });

	  request.open('POST', '/deletecartproduct');
	  request.send(JSON.stringify({activeaccount:account,id:id}));
}


function update_cartquantity(id,cartquan,selectedquan)
{
    
    for(var j=0;j<cartproducts.length;j++)
        {
            if(cartproducts[j].id==id)
                break;
        }
 
    for(var h=0;h<products.length;h++)
        {
            if(products[h].id==id)
                {
                    price=products[h].price;
                    break;
                }
        }
                    var ob=addcp(id,selectedquan);
                    var mainob=mainobj(ob);
                
                    updateStoredCartProducts(mainob,function(){
                          
                      total=total-(parseInt(arr[j].cquantity)*parseInt(price));
                      cartproducts[j].cquantity=parseInt(selectedquan);
                      total=total+(parseInt(cartproducts[j].cquantity)*parseInt(price));
                      
                      //alert(id);
                      var k=document.getElementsByClassName(id);
                      k[0].textContent="x"+arr[j].cquantity;
                      k[1].textContent=parseInt(cartproducts[j].cquantity)*parseInt(price);
                      
                      var checkout=document.getElementById("btn_checkout");
                      checkout.innerHTML="SUBTOTAL: Rs."+total+"<br><hr>CHECKOUT";
                    });
                
   
}


function addcp(a,b)
{
    return cprod={
        id:a,
        cquantity:parseInt(b)
    }
}

function mainobj(ob)
{
    return obj={
        activeaccount:account,
        data:ob
    }
}

function updateStoredCartProducts(ob,callback)
{
        var request=new XMLHttpRequest();
     request.addEventListener('load', function() 
	  {
		if (request.status === STATUS_OK) {
			 flag=JSON.parse(request.responseText);
            if(flag==true)
		     callback();
            else
                alert("updation failed");
		}
	  });

	  request.open('POST', '/updatecartproduct');
	  request.send(JSON.stringify(ob));
}



var checkout=document.getElementById("btn_checkout");
checkout.addEventListener("click", function(event) 
    {
    alert("placing order");
    placeorder();
    });

function placeorder()
{
    var d=new Date();
    var order=getorder(d);
    var details=[];
    
    for(var j=0;j<cartproducts.length;j++)
        {
            id=cartproducts[j].id;
            for(var i=0;i<products.length;i++)
                {
                    if(products[i].id==id)
                        break;
                }
            decrease_quantities_in_products(products[i],cartproducts[j].cquantity);
            
            var detail=getProductDetail(products[i],cartproducts[j].cquantity);
            details.push(detail);
        }
    var orderdetail=getorderdetail(details);
    
    client_order={email:account, data:[{orderid:orderid, date:d, ordered_data:ordered_data}]};
    
    storeOrder(order,function(){
        storeOrderDetail(orderdetail,function(){
            reduceQuantityInProducts(products,function(){
                deleteStoredCartProducts(-1,function(){
                    storePlacedOrder_for_clientview(client_order,function(){
                       document.location.href="orderplaced.html";
                  });
              });
          });
       });
    });
    
}



function getorder(d)
{
    return order={
        orderid:orderid,
        username:active_account.name,
        email:account,
        status:0,
        date:d,
        address:"abc"
    }
}


function getProductDetail(product,qty)
{
    return detail={
        name:product.name,
        description:product.description,
        price:product.price,
        buyed_quantity:qty
    }
}


function getorderdetail(details)
{
    return orderdetail={
        orderid:orderid,
        details:details  //detail is array of all product detail in order
    }
}



function decrease_quantities_in_products(product,cquantity)
{
    product.quantity = parseInt(product.quantity)-parseInt(cquantity);
}



function storeOrder(ob,callback)
{
      var request=new XMLHttpRequest();
     request.addEventListener('load', function() 
	  {
		if (request.status === STATUS_OK) {
			 flag=JSON.parse(request.responseText);
            if(flag==true)
		     callback();
            else
                alert("order placing failed");
		}
	  });

	  request.open('POST', '/placeorder');
	  request.send(JSON.stringify(ob));  
}



function storeOrderDetail(ob,callback)
{
     var request=new XMLHttpRequest();
     request.addEventListener('load', function() 
	  {
		if (request.status === STATUS_OK) {
			 flag=JSON.parse(request.responseText);
            if(flag==true)
		     callback();
            else
                alert("order placing failed");
		}
	  });

	  request.open('POST', '/storeorderdetails');
	  request.send(JSON.stringify(ob));     
}


function reduceQuantityInProducts(products,callback)
{
    var request=new XMLHttpRequest();
     request.addEventListener('load', function() 
	  {
		if (request.status === STATUS_OK) {
			 flag=JSON.parse(request.responseText);
            if(flag==true)
		     callback();
            else
                alert("order placing failed at reducing products");
		}
	  });

	  request.open('POST', '/reduceinproducts_correspondingtoCart');
	  request.send(JSON.stringify(products));
}


function storePlacedOrder_for_clientview(client_order,callback)
{
    var request=new XMLHttpRequest();
     request.addEventListener('load', function() 
	  {
		if (request.status === STATUS_OK) {
			 flag=JSON.parse(request.responseText);
            if(flag==true)
		       callback();
		}
	  });

	  request.open('POST', '/storeclientorder_forview');
	  request.send(JSON.stringify(client_order));
}
