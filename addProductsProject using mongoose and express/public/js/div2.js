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
    }
  });

  request.open("GET", '/getactiveuser');
  request.send();
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
        //document.location.href = "account.html";
        document.location.href = "/logout";
            }
    });
    
     cartbtn.addEventListener("click", function(event) 
    {
        document.location.href = "displaycart.html";
        
    });
    
      view_ordersbtn.addEventListener("click", function(event) 
    {
        document.location.href = "viewplacedorders.html";
            
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
getStoredCartProducts()

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




function getStoredProducts()
{
     var request = new XMLHttpRequest();
   request.addEventListener('load', function() 
  {
    if (request.status === STATUS_OK) {
      products = JSON.parse(request.responseText);
            //alert(products.length);
        viewProducts();
    }
       else console.log('products getting failed')
  });
  
  request.open("GET", '/products/getproducts');
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
                   
                    var s="<h4><b>"+products[i].name+"</b><br><img src="+products[i].productImage+" style='width:150px;height:150px;padding left:45px'></img><br><ul><li>Category:"+products[i].category+"</li><li>Price:"+products[i].price+"</li></ul></h4>";
                    cdiv.innerHTML=s;
                }
                else if(j==1)
                {
                    cdiv.setAttribute("style", "float: left; margin-left:70px;margin-top:120px");
                    style_quantity_cdiv(cdiv,products[i],i);
                }
                else if(j==2)
                {
                    cdiv.setAttribute("style", "float: left; margin-left:60px;margin-top:110px");
                    style_addcart_button_cdiv(cdiv,products[i]);
                    var breakLine=document.createElement("br");
                     breakLine.setAttribute("style","clear:both");
                    linediv.appendChild(breakLine);
                }
            }
    }
}

function style_quantity_cdiv(cdiv,product,j)//j= product index
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
    if(product.quantity==0)
    {
        mbtn.style.backgroundColor="gray";
        mbtn.disabled=true;
    }
    
    pbtn.setAttribute("style","background-color:#4CAF50;padding:3px 8px;color:white;opacity:.8");
    if(product.quantity==0)
    {
        pbtn.style.backgroundColor="gray";
        pbtn.disabled=true;
    }
    
    txt.setAttribute("id",product._id);
    txt.style.width="40px";
    txt.style.disabled="yes";
    txt.style.textAlign="center";
    //txt.style.border="2px solid red";
    //txt.style.backgroundColor="lightblue";
    pbtn.addEventListener("click",function(event){
                    //alert("plussing");
                    increase_quantity(product._id,j);
        });
    mbtn.addEventListener("click",function(event){
                    //alert("minusing");
                    //alert(parent.nodeName);
                    decrease_quantity(product._id);
        });
}


function increase_quantity(id,ind)
{
    //var quan=parent.childNodes[1];   //quan will be textbox
    //var id=quan.getAttribute("id");   //id that of products
    var quan=document.getElementById(id);
  
    //alert(quan.value);
    var total=products[ind].quantity;
    var n=quan.value;
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


function style_addcart_button_cdiv(cdiv,product)
{
    cbtn=document.createElement("button");
    cbtn.setAttribute("style","background-color:#4CAF50;padding:8px 16px;color:white;");
    if(product.quantity==0)
    {
        cbtn.style.backgroundColor="gray";
        cbtn.disabled=true;
    }
    cbtn.innerHTML="ADD PRODUCT TO CART";
    cdiv.appendChild(cbtn);
    cbtn.addEventListener("click",function(){
        add_to_cart_fun(product);
    });
}

function add_to_cart_fun(product)   //i have put class same as id
{
    //alert(id);
    var btn=document.getElementById("btn_checkout");
    btn.style.display="block";
    btn.style.marginLeft="150px";
    var quan=document.getElementById(product._id);
    var flag=0;
    var j,index;
    
        for(var k=0;k<cartproducts.length;k++)
        {
             if(cartproducts[k]._id==product._id)
             {
                 alert(quan.value)
             alert("updating");
             checkandupdate_cartquantity(k,product,quan);//-------------------------
             flag=1;
             break;
             }
        }
           alert(quan.value)   
      if(flag==0)
      {
          
          var ob=addcp(product._id,product.name,product.price,quan.value);
          //var mainob=mainobj(ob);
          
          storeCartProducts(ob,function(){
              cartproducts.push(ob);
              show_in_cart(ob,cartproducts.length);
              alert("added");
          });
          
      }
    
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

function checkandupdate_cartquantity(j,product,quan)
{
    
    cart_quan=cartproducts[j].cquantity;
    alert(cart_quan)
    var totalquan;

    price=product.price;
    totalquan=product.quantity;
    var left_items_for_cart=parseInt(totalquan)-parseInt(cart_quan);
    var new_total_will_be=parseInt(cart_quan)+parseInt(quan.value);
alert('new'+new_total_will_be)
    
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
                    alert('valid')
                    var ob=addcp(product._id,product.name,product.price,new_total_will_be);
                    //var mainob=mainobj(ob);
                    
                    updateStoredCartProducts(ob,function(){
                        
                         total=total-(parseInt(cartproducts[j].cquantity)*price);
                    alert('new'+new_total_will_be)
                         cartproducts[j].cquantity=new_total_will_be;
                         total=total+(parseInt(cartproducts[j].cquantity)*price);
                         
                         var k=document.getElementsByClassName(product._id);
                         k[0].textContent="x"+cartproducts[j].cquantity;
                         k[1].textContent=parseInt(cartproducts[j].cquantity)*price;
                         alert("CART UPDATED. Added "+quan.value+" more of this product to your cart.");
                         
                         var checkout=document.getElementById("btn_checkout");
                         checkout.innerHTML="SUBTOTAL: Rs."+total+"<br>";
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




function show_in_cart(cpdt,index)
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
    //alert(pdt._id);
    labelquantity.setAttribute("class",cpdt._id);
    pdtdiv.appendChild(quantitytag);
    pdtdiv.appendChild(labelquantity);
    var breakLine=document.createElement("br");
    breakLine.setAttribute("style","clear:both");
    pdtdiv.appendChild(breakLine);
   
    
    Totaltag.setAttribute("style", "float: left; margin-left:10px");
    labelTotal.setAttribute("style", "float: right; margin-right:10px;margin-top:3px");
    labelTotal.setAttribute("class",cpdt._id);
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
    
    
    pdtdiv.appendChild(horizontal);
    labelname.textContent=cpdt.name;
    labelprice.textContent="Rs "+cpdt.price;
    quantitytag.textContent="Quantuty:"
    labelquantity.textContent="x"+cpdt.cquantity;
    Totaltag.textContent="Total:";
//alert("prev"+total);
    var pr=parseInt(cpdt.cquantity)*parseInt(cpdt.price)
    total=total+pr;
   // alert("new"+total);
    labelTotal.textContent=pr;
    remove.textContent="remove";
    
    checkout.innerHTML="SUBTOTAL: Rs."+total+"<br>";
    
    cart.insertBefore(pdtdiv,checkout);
    
   remove.addEventListener("click", function(event) 
    {
    //alert("flag="+flag);
    remove_fun(cpdt._id,index,remove);
    }); 
    
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



function storeCartProducts(ob,callback)
    {
        var request=new XMLHttpRequest();
     request.addEventListener('load', function() 
	  {
		if (request.status === STATUS_OK) {
		     callback();       
		}
         else
           alert("addition failed");
	  });

	  request.open('POST', '/cartproducts/addproduct');
      request.setRequestHeader("Content-type", "application/json");
	  request.send(JSON.stringify(ob));
    }


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

	  request.open('POST', '/cartproducts/deletecartproduct');
      request.setRequestHeader("Content-type", "application/json");
	  request.send(JSON.stringify({id:id}));
    }




