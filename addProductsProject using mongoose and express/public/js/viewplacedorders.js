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

////creating side bar of logout and viewcart option
make_sidebar();
function make_sidebar()
{
var side=document.getElementById("side_bar_div");
var logoutbtn=document.createElement("button");
var addmorebtn=document.createElement("button");
var view_cartbtn=document.createElement("button");
    
logoutbtn.textContent="Logout";
addmorebtn.textContent="order products";
view_cartbtn.textContent="view cart";
    
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

view_cartbtn.setAttribute("style","background-color:darkgreen;padding:10px 10px;color:white;border-radius:3px;margin-top:10px;margin-left:10px;margin-right:10px");
side.appendChild(view_cartbtn);
    
    
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
    
    view_cartbtn.addEventListener("click", function(event) 
    {
        document.location.href = "displaycart.html";
            
    });
}

//////////////

var STATUS_OK=200;

var orders=[];
getStoredPlacedOrders();
var total=0;

function getStoredPlacedOrders()
{
  var request = new XMLHttpRequest();
  
   request.addEventListener('load', function() 
  {
    if (request.status === STATUS_OK) {
       orders = JSON.parse(request.responseText);
            //alert(orders.length);
      start();
    }
     else
       alert("orders fetching failed")       
  });

  request.open("GET", '/getclientorders_forview');
  request.send());
}



function start()
{
    var main=document.getElementById("main");
    for(var i=0;i<orders.length;i++)
    {
        
        var orderdiv=document.createElement("div");
        orderdiv.setAttribute("style","padding:30px 30px;text-align: center;width:400px;background-color: antiquewhite;")
        var totalbtn=document.createElement("button");
        totalbtn.setAttribute("style","margin-left:130px;display:block;padding:8px 16px;background-color: #4CAF50;color:white;margin-bottom: 10px;");
        orderdiv.appendChild(totalbtn);
        
      var  ordered_data=orders[i].data;  
      var orderid=orders[i].orderid;  
      var date=orders[i].date;
      total=0;  
        
       var ddiv=document.createElement("div");
       var labeldate=document.createElement("label");
       labeldate.textContent="Dated "+date;
        ddiv.appendChild(labeldate);
       var breakLine=document.createElement("br");
       ddiv.appendChild(breakLine);
       orderdiv.insertBefore(ddiv,totalbtn);
      for(var j=0;j<ordered_data.length;j++)
          {
              show_ordered_data(orderdiv,totalbtn,ordered_data[j]);
          }
       totalbtn.innerHTML="SUBTOTAL: Rs."+total;
        var hr=document.createElement("hr");
          hr.setAttribute("style","clear:both");
          orderdiv.insertBefore(hr,totalbtn);
        
         main.appendChild(orderdiv);
          var hr=document.createElement("hr");
          hr.setAttribute("style","clear:both");
          main.appendChild(hr);
      }
}

function show_ordered_data(orderdiv,totalbtn,item)
{
    var pdtdiv=document.createElement("div");
    var labelname=document.createElement("label");
    var labelprice=document.createElement("label");
    var labelquantity=document.createElement("label");
    var labelTotal=document.createElement("label");
    var Totaltag=document.createElement("label");
    var quantitytag=document.createElement("label");
    var br=document.createElement("br"); 
    
    labelname.setAttribute("style", "float: left; margin-left:10px;");
    labelprice.setAttribute("style", "float: right; margin-right:10px;margin-top:3px");
    pdtdiv.appendChild(labelname);
    pdtdiv.appendChild(labelprice);
    var breakLine=document.createElement("br");
    breakLine.setAttribute("style","clear:both");
    pdtdiv.appendChild(breakLine);
    
    quantitytag.setAttribute("style", "float: left; margin-left:10px");
    labelquantity.setAttribute("style", "float: right; margin-right:10px;margin-top:3px");
    pdtdiv.appendChild(quantitytag);
    pdtdiv.appendChild(labelquantity);
    var breakLine=document.createElement("br");
    breakLine.setAttribute("style","clear:both");
    pdtdiv.appendChild(breakLine);
    
    Totaltag.setAttribute("style", "float: left; margin-left:10px");
    labelTotal.setAttribute("style", "float: right; margin-right:10px;margin-top:3px");
    pdtdiv.appendChild(Totaltag);
    pdtdiv.appendChild(labelTotal);
    var breakLine=document.createElement("br");
    breakLine.setAttribute("style","clear:both");
    pdtdiv.appendChild(breakLine);
    
     pdtdiv.appendChild(br);
    labelname.textContent=item.name;
    labelprice.textContent=item.price;
    quantitytag.textContent="Quantuty:";
    labelquantity.textContent="x"+item.cquantity;
    Totaltag.textContent="Total:";
    var pr=parseInt(item.cquantity)*parseInt(item.price)
    total=total+pr;
    labelTotal.textContent=pr; 
    
    orderdiv.insertBefore(pdtdiv,totalbtn);
}