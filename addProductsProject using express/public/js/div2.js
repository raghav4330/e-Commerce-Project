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




////craeting side bar of logout and viewcart option
make_sidebar();
function make_sidebar()
{
var side=document.getElementById("side_bar_div");
var logoutbtn=document.createElement("button");
var cartbtn=document.createElement("button");
var view_ordersbtn=document.createElement("button");
    
logoutbtn.textContent="Logout";
cartbtn.textContent="view cart";
view_ordersbtn.textContent="view orders";    

logoutbtn.setAttribute("style","background-color:red;padding:8px 18px;color:white;border-radius:3px;margin-top:10px;margin-left:10px");
side.appendChild(logoutbtn);
var breakLine=document.createElement("br");
    side.appendChild(breakLine);
var breakLine=document.createElement("br");
    side.appendChild(breakLine);
cartbtn.setAttribute("style","background-color:blue;padding:10px 10px;color:white;border-radius:3px;margin-top:10px;margin-left:10px");
side.appendChild(cartbtn);
    
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
    
     cartbtn.addEventListener("click", function(event) 
    {
        document.location.href = "displaycart.html";
        
    });
} 

//////////////





 
    
    
//////   creating remaining cart part
   
var total=0;
var products=[];
var cartproducts=[];
var main=document.getElementById("select_products");

var STATUS_OK=200;

getStoredProducts();
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
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify({acc:account}));
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




function getStoredProducts()
{
     var request = new XMLHttpRequest();
  
   request.addEventListener('load', function() 
  {
    if (request.status === STATUS_OK) {
      products = JSON.parse(request.responseText);
            //alert(cartproducts.length);
        viewProducts();
    }
  });
  
  request.open("GET", '/getproducts');
  request.send();
}


function viewProducts()
{
  main=document.getElementById("select_products");
  var outerdiv=document.createElement("div");
  outerdiv.setAttribute("cellspacing","10px");
  outerdiv.setAttribute("cellpadding","10px");
  main.appendChild(outerdiv);


 for(var i=0;i<products.length;i++)
    {
        linediv=document.createElement("div");
        outerdiv.appendChild(linediv);
        
        for(var j=0;j<4;j++)
            {
                
                var cdiv=document.createElement("div");
                linediv.appendChild(cdiv);

                if(j==0)
                {
                    cdiv.setAttribute("style", "float: left; margin-left:10px;margin-top:10px");
                   
                    var s="<h4><b>"+products[i].name+"</b><br><ul><li>"+products[i].description+"</li><li>Price:"+products[i].price+"</li></ul></h4>";
                    cdiv.innerHTML=s;
                }
                else if(j==1)
                {
                    cdiv.setAttribute("style", "float: left; margin-left:70px;margin-top:70px");
                    cdiv.setAttribute("id","cdiv_"+products[i].id);
                    style_quantity_cdiv(cdiv,products[i].id,products[i].quantity);
                }
                else if(j==2)
                {
                    cdiv.setAttribute("style", "float: left; margin-left:60px;margin-top:65px");
                    style_addcart_button_cdiv(cdiv,products[i].id);
                    var breakLine=document.createElement("br");
                     breakLine.setAttribute("style","clear:both");
                    linediv.appendChild(breakLine);
                }
            }
    }
}

function style_quantity_cdiv(cdiv,id,quantity)
{
    pbtn=document.createElement("button");//plus button
    mbtn=document.createElement("button");//minus__button
    txt=document.createElement("input");
    cdiv.append(mbtn);
    cdiv.append(txt);
    cdiv.append(pbtn);
    
    txt.value=1;
    mbtn.innerHTML="-";
    pbtn.innerHTML="+";
    mbtn.setAttribute("style","background-color:#4CAF50;padding:3px 8px;color:white;opacity:.8");
    if(quantity==0)
    {
        mbtn.style.backgroundColor="gray";
        mbtn.disabled=true;
    }
    
    pbtn.setAttribute("style","background-color:#4CAF50;padding:3px 8px;color:white;opacity:.8");
    if(quantity==0)
    {
        pbtn.style.backgroundColor="gray";
        pbtn.disabled=true;
    }
    
    txt.setAttribute("id",id);
    txt.style.width="40px";
    txt.style.disabled="yes";
    txt.style.textAlign="center";
    //txt.style.border="2px solid red";
    //txt.style.backgroundColor="lightblue";
    pbtn.addEventListener("click",function(event){
                    //alert("plussing");
                    increase_quantity(id);
        });
    mbtn.addEventListener("click",function(event){
                    //alert("minusing");
                    //alert(parent.nodeName);
                    decrease_quantity(id);
        });
}


function increase_quantity(id)
{
    //var quan=parent.childNodes[1];   //quan will be textbox
    //var id=quan.getAttribute("id");   //id that of products
    var quan=document.getElementById(id);
  
    //alert(quan.value);
    var total;
    var n=quan.value;
    for(var j=0;j<products.length;j++)
        {
            if(products[j].id==id)
            {
                total=products[j].quantity;
                break;
            }
        }
    //alert("total="+total);
    if(parseInt(quan.value)==total && parseInt(quan.value)!=10)
        alert("sorry.stock limit reached!. Only "+total+" left in stock");
    else
      {
    if(quan.value>=10)
    {
        quan.value=10;
        alert("maximum of 10 quantity are available per customer");
    }
    else
        quan.value=parseInt(quan.value)+1;
      }
}

function decrease_quantity(id)
{
    //alert(parent.nodeName);
    //var quan=parent.childNodes[1];   //quan will be textbox
    var quan=document.getElementById(id);
  
    //alert(quan.value);
    if(quan.value>1)
        {
            quan.value=quan.value-1;
        }
}


function style_addcart_button_cdiv(cdiv,id,quantity)
{
    cbtn=document.createElement("button");
    cbtn.setAttribute("style","background-color:#4CAF50;padding:8px 16px;color:white;");
    if(quantity==0)
    {
        cbtn.style.backgroundColor="gray";
        cbtn.disabled=true;
    }
    cbtn.innerHTML="ADD PRODUCT TO CART";
    cdiv.appendChild(cbtn);
    cbtn.addEventListener("click",function(){
        add_to_cart_fun(id);
    });
}

function add_to_cart_fun(id)   //i have put class same as id
{
    //alert(id);
    var btn=document.getElementById("btn_checkout");
    btn.style.display="block";
    btn.style.marginLeft="150px";
    var quan=document.getElementById(id);
    var flag=0;
    var j,index;
    
        for(var k=0;k<cartproducts.length;k++)
        {
             if(cartproducts[k].id==id)
             {
             alert("updating");
             checkandupdate_cartquantity(k,id,quan);
             flag=1;
             break;
             }
        }
              
      if(flag==0)
      {
          
          var ob=addcp(id,quan.value);
          var mainob=mainobj(ob);
          
          cartproducts.push(ob);
          storeCartProducts(mainob,function(){
              show_in_cart(ob);
              alert("added");
          });
          
      }
    
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

function checkandupdate_cartquantity(j,id,quan)
{
    
    cart_quan=cartproducts[j].cquantity;
    var totalquan;
    for(var h=0;h<products.length;h++)
        {
            if(products[h].id==id)
                {
                    price=products[h].price;
                    totalquan=products[h].quantity;
                    break;
                }
        }
    var left_items_for_cart=parseInt(totalquan)-parseInt(cart_quan);
    var new_total_will_be=parseInt(cart_quan)+parseInt(quan.value);

    
    if(new_total_will_be<=10)
        {
            if(totalquan<10 && new_total_will_be>totalquan)
            {
                alert("Sorry.Stock limit reached."+totalquan+" left in stock and you already have "+cart_quan+" in your cart.you can maximum upto "+left_items_for_cart+" more quantities for this product");
                
                if(left_items_for_cart!=0)
                quan.value=left_items_for_cart;
                else
                   quan.value=1; 
            }
            else
                {
                    var ob=addcp(id,quan.value);
                    var mainob=mainobj(ob);
                    
                    updateStoredCartProducts(mainob,function(){
                        
                         total=total-(parseInt(cartproducts[j].cquantity)*parseInt(price));
                    
                         cartproducts[j].cquantity=parseInt(cartproducts[j].cquantity)+parseInt(quan.value);
                         total=total+(parseInt(cartproducts[j].cquantity)*parseInt(price));
                         
                         var k=document.getElementsByClassName(id);
                         k[0].textContent="x"+cartproducts[j].cquantity;
                         k[1].textContent=parseInt(cartproducts[j].cquantity)*parseInt(price);
                         alert("CART UPDATED. Added "+quan.value+" more of this product to your cart.");
                         
                         var checkout=document.getElementById("btn_checkout");
                         checkout.innerHTML="SUBTOTAL: Rs."+total+"<br><hr>CHECKOUT";
                    });
                   
                }
        }
    else
        {
            if(totalquan<10)
            {
                alert("Sorry.Stock limit reached."+totalquan+" left in stock and you already have "+cart_quan+" in your cart.you can maximum upto "+left_items_for_cart+" more quantities for this product");
            
                if(left_items_for_cart!=0)
                quan.value=left_items_for_cart;
                else
                   quan.value=1;
            }
            
            else
                {
                    var items=10-parseInt(cart_quan);
                    alert("maximum of 10 quantity are available per customer.you already have "+cart_quan+" in your cart.you can maximum upto "+items+" more quantities for this product");
                }
        }
    
   
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
    labelquantity.setAttribute("style", "float: right; margin-right:10px;margin-top:3px");
    //alert(pdt.id);
    labelquantity.setAttribute("class",pdt.id);
    pdtdiv.appendChild(quantitytag);
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
    
    pdtdiv.appendChild(horizontal);
    labelname.textContent=products[j].name;
    labelprice.textContent="Rs "+products[j].price;
    quantitytag.textContent="Quantuty:"
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



function storeCartProducts(ob,callback)
    {
        var request=new XMLHttpRequest();
     request.addEventListener('load', function() 
	  {
		if (request.status === STATUS_OK) {
			 flag=JSON.parse(request.responseText);
            if(flag==true)
		     callback();
            else
                alert("addition failed");
		}
	  });

	  request.open('POST', '/addcartproduct');
      request.setRequestHeader("Content-type", "application/json");
	  request.send(JSON.stringify(ob));
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
      request.setRequestHeader("Content-type", "application/json");
	  request.send(JSON.stringify(ob));
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
      request.setRequestHeader("Content-type", "application/json");
	  request.send(JSON.stringify({activeaccount:account,id:id}));
    }




