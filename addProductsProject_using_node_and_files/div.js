var total=0;
var products=[];
var cartproducts=[];
products=getStoredProducts();
cartproducts=getStoredCartProducts();
check_for_products();

if(cartproducts.length!=0)
{
    var btn=document.getElementById("btn_checkout");
    btn.setAttribute("style","margin-left:150px;display:block;padding:8px 16px;background-color: #4CAF50;color:white;margin-bottom: 10px;")
for(var j=0;j<cartproducts.length;j++)
    {
        show_in_cart(cartproducts[j]);
    }
}

cartprintarray();
//printarray();

function getStoredProducts()
{
if (!localStorage.products)
{
// default to empty array
localStorage.products = JSON.stringify([]);
}
return JSON.parse(localStorage.products);
}

var main=document.getElementById("select_products");
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
                    style_quantity_cdiv(cdiv,products[i].id);
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

function style_quantity_cdiv(cdiv,id)
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
    mbtn.setAttribute("style","background-color:#4CAF50;");
    mbtn.style.padding= "3px 8px";
    mbtn.style.color=" white";
    mbtn.style.opacity=".7";
    
    pbtn.style.backgroundColor=" #4CAF50";
    pbtn.style.padding= "3px 8px";
    pbtn.style.backgroundColor=" #4CAF50";
    pbtn.style.color=" white";
    pbtn.style.opacity=".7";
    pbtn.style.opacity=".7";
    
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


function style_addcart_button_cdiv(cdiv,id)
{
    cbtn=document.createElement("button");
    cbtn.style.padding= "8px 16px";
    cbtn.style.backgroundColor=" #4CAF50";
    cbtn.style.color=" white";
    cbtn.innerHTML="ADD PRODUCT TO CART";
    cdiv.appendChild(cbtn);
    cbtn.addEventListener("click",function(){
        //alert("going to add");
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
    for(var j=0;j<cartproducts.length;j++)
        {
            if(cartproducts[j].id==id)
                {
                    alert("updating");
                    checkandupdate_cartquantity(j,id,quan);
                    flag=1;
                    break;
                }
        }
    if(flag==0)
    {
        var totalquantityprice;
        
        var ob=addcp(id,quan.value);
        cartproducts.push(ob);
        show_in_cart(ob);
        alert("Added to Cart");
    }
    
    storeCartProducts();
    alert(total);
    cartprintarray();
}

function addcp(a,b)
{
    return cprod={
        id:a,
        cquantity:b
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
                    total=total-(parseInt(cartproducts[j].cquantity)*parseInt(price));
                    
                    cartproducts[j].cquantity=parseInt(cartproducts[j].cquantity)+parseInt(quan.value);
                    total=total+(parseInt(cartproducts[j].cquantity)*parseInt(price));
                    
                    //alert(id);
                    var k=document.getElementsByClassName(id);
                    k[0].textContent="x"+cartproducts[j].cquantity;
                    k[1].textContent=parseInt(cartproducts[j].cquantity)*parseInt(price);
                    alert("CART UPDATED. Added "+quan.value+" more of this product to your cart.");
                    
                    var checkout=document.getElementById("btn_checkout");
                    checkout.innerHTML="SUBTOTAL: Rs."+total+"<br><hr>CHECKOUT";
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
    
     storeCartProducts();
   
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
    
    
     for(var j=0;j<cartproducts.length;j++)
        {
            if(cartproducts[j].id==id)
                {
                    cartproducts.splice(j,1);
                }
        }
    
    if(cartproducts.length==0)
        {
            btn=document.getElementById("btn_checkout");
            btn.setAttribute("style","display:none");
        }
    
   storeCartProducts();
    cartprintarray();
}



function storeCartProducts()
    {
        localStorage.cartproducts = JSON.stringify(cartproducts);
    }


function getStoredCartProducts()
{
if (!localStorage.cartproducts)
{
// default to empty array
localStorage.cartproducts = JSON.stringify([]);
}
return JSON.parse(localStorage.cartproducts);
}


function printarray()
{
    for(var c=0;c<products.length;c++)
        alert(products[c].name);
}
function cartprintarray()
{
    var s="";
    for(var c=0;c<cartproducts.length;c++)
        s=s+cartproducts[c].id+" "+cartproducts[c].cquantity+"    |     ";
    var just=document.getElementById("just");
    just.innerHTML=s;
}

function check_for_products()
{
    if(products.length==0)
        {
            for(var j=cartproducts.length-1;j>=0;j--)
                cartproducts.splice(j,1);
            storeCartProducts();
        }
    for(var j=cartproducts.length-1;j>=0;j--)
        {
            var k=cartproducts[j].id;
            var flag=0;
            for(h=0;h<products.length;h++)
                {   
                  if(products[h].id==k)
                        {
                            flag=1;
                            break;
                        }
                }
            if(flag==0)
                cartproducts.splice(j,1);
        }
    storeCartProducts();
}



/*
 if(parseInt(cart_quan)+parseInt(quan.value)>parseInt(totalquan))
        alert("stock limit reached.only "+left_items_for_cart+" more items can be added to the cart for this product");
    else
    {
        cartproducts[j].cquantity=parseInt(cartproducts[j].cquantity)+parseInt(quan.value);
        alert("cart updated."+quan.value+" more added");
    }
    
    
    
     for(var j=0;j<cartproducts.length;j++)
        {
            if(products[j].id==id)
                {
                    totalquantityprice=parseInt(products[j].price)*parseInt(quan.value);
                }
        }
    */