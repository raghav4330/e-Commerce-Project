var nn=document.getElementById("welcome");
getactiveaccount();
function getactiveaccount()
{
  var request = new XMLHttpRequest();
  
   request.addEventListener('load', function()  
  {
    if (request.status === STATUS_OK) {
       activename = JSON.parse(request.responseText);
      nn.innerHTML="hi "+activename+"!";
        
        getStoredCartProducts();
    }
  });

  request.open("GET", '/getactiveuser');
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
        document.location.href = "/logout";
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

var STATUS_OK=200;

//getParticularStoredProducts();


function getStoredCartProducts()
{
    //alert('cartproducts getting ')
  var request = new XMLHttpRequest();
  
   request.addEventListener('load', function()  
  {
    if (request.status === STATUS_OK) {
       cartproducts = JSON.parse(request.responseText);
         //alert("cartlength "+cartproducts.length);
      start();
    }
       else console.log('cartproducts getting failed')
  });

  request.open("GET", '/cartproducts/getcartproducts'); 
  request.send();
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
            show_in_cart(cartproducts[j],j);
        }
    }
}


//function getParticularStoredProducts()
//{
//     var request = new XMLHttpRequest();
//  
//   request.addEventListener('load', function() 
//  {
//    if (request.status === STATUS_OK) {
//      products = JSON.parse(request.responseText);
//        
//        getStoredCartProducts();
//    }
//  });
//  
//  request.open("POST", '/getproducts_corespondingtoCart');
//  request.setRequestHeader("Content-type", "application/json");
//   request.send(JSON.stringify({acc:account}));
//}



function show_in_cart(pdt,index)
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
    dropdown.setAttribute("id",pdt._id);
    labelquantity.setAttribute("style", "float: right; margin-right:10px;margin-top:3px");
    labelquantity.setAttribute("class",pdt._id);
    pdtdiv.appendChild(quantitytag);
    pdtdiv.appendChild(dropdown);
    pdtdiv.appendChild(labelquantity);
    var breakLine=document.createElement("br");
    breakLine.setAttribute("style","clear:both");
    pdtdiv.appendChild(breakLine);
   
    
    Totaltag.setAttribute("style", "float: left; margin-left:10px");
    labelTotal.setAttribute("style", "float: right; margin-right:10px;margin-top:3px");
    labelTotal.setAttribute("class",pdt._id);
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
    
//    var j;
//    for(j=0;j<products.length;j++)
//        {
//            if(products[j].id==pdt.id)
//                break;
//        }
    
    pdtdiv.appendChild(horizontal);
    labelname.textContent=pdt.name;
    labelprice.textContent="Rs "+pdt.price;
    quantitytag.textContent="Quantuty:";
    addindropdown(dropdown,10,pdt.cquantity); //products[j].quantitydt
    dropdown.value=parseInt(pdt.cquantity);
    labelquantity.textContent="x"+pdt.cquantity;
    Totaltag.textContent="Total:";
//alert("prev"+total);
    var pr=parseInt(pdt.cquantity)*parseInt(pdt.price)
    total=total+pr;
   // alert("new"+total);
    labelTotal.textContent=pr;
    remove.textContent="remove";
    
    checkout.innerHTML="SUBTOTAL: Rs."+total+"<br><hr>CHECKOUT";
    
    cart.insertBefore(pdtdiv,checkout);
    
   remove.addEventListener("click", function(event) 
    {
    //alert("flag="+flag);
    remove_fun(pdt._id,index,remove);
    });
    
   dropdown.addEventListener("change", function(event) 
    {
    //alert(dropdown.value);
    update_cartquantity(pdt,index,dropdown.value);
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

function remove_fun(id,index,removebtn)
{
    var parent=removebtn.parentNode;
    
    while(parent.firstChild)
        {
            parent.removeChild(parent.firstChild);
        }
    parent.parentNode.removeChild(parent);
    
    
     deleteStoredCartProducts(id,function(){
         
       cartproducts.splice(index,1);
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
		     callback();
		 }
         else
            alert("deletion failed");
	  });

	  request.open('POST', 'cartproducts/deletecartproduct');
      request.setRequestHeader("Content-type", "application/json");
	  request.send(JSON.stringify({id:id}));
}


function update_cartquantity(pdt,index,selectedquan)
{
    price=parseInt(cartproducts[index].price);
    alert(price)
 
                    var ob=addcp(pdt._id,cartproducts[index].name,cartproducts[index].price,selectedquan);
                   // var mainob=mainobj(ob);
                
                    updateStoredCartProducts(ob,function(){
                          
                      total=total-(parseInt(cartproducts[index].cquantity)*price);
                      cartproducts[index].cquantity=parseInt(selectedquan);
                      total=total+(parseInt(cartproducts[index].cquantity)*price);
                      
                      //alert(id);
                      var k=document.getElementsByClassName(pdt._id);
                      k[0].textContent="x"+cartproducts[index].cquantity;
                      k[1].textContent=parseInt(cartproducts[index].cquantity)*price;
                      
                      var checkout=document.getElementById("btn_checkout");
                      checkout.innerHTML="SUBTOTAL: Rs."+total+"<br><hr>CHECKOUT";
                    });
                
   
}


function addcp(a,b,c,d)
{
    return cprod={
        _id:a,
        name:b,
        price:parseInt(c),
        cquantity:parseInt(d)
    }
}

//function mainobj(ob)
//{
//    return obj={
//        activeaccount:account,
//        data:ob
//    }
//}

function updateStoredCartProducts(ob,callback)
    {
        var request=new XMLHttpRequest();
     request.addEventListener('load', function() 
	  {
		if (request.status === STATUS_OK) {
		     callback();
		}
         else
            alert("updation failed");
	  });

	  request.open('POST', '/cartproducts/updatecartproduct');
      request.setRequestHeader("Content-type", "application/json"); 
	  request.send(JSON.stringify(ob));
    }



var checkout=document.getElementById("btn_checkout");
checkout.addEventListener("click", function(event){
    placeOrder(function(){
       document.location.href="orderplaced.html";
    });
});

/*function getAddress()
{   
    placeOrder(function(){
       document.location.href="orderplaced.html"; 
    });
    
}*/




function placeOrder(callback)
{
      var request=new XMLHttpRequest();
     request.addEventListener('load', function() 
	  {
		if (request.status === STATUS_OK) {
		     callback();
		}
         else
           alert("order placing failed");
	  });

	  request.open('GET', '/placeorder');
	  request.send();  
}

