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

//////////////


var logout=document.getElementById("logout");
var addproducts=document.getElementById("add_products");
var home=document.getElementById("orders");

  logout.addEventListener("click", function(event) 
    {
        flag=confirm("do you want to logout");
        if(flag==true)
            {
        document.location.href = "/logout";
            }
    });

  addproducts.addEventListener("click", function(event) 
    {
        document.location.href = "display_page.html";
    });

    home.addEventListener("click", function(event) 
    {
        document.location.href = "home.html";
    });

/////////////////////

var statuses=["awaiting order","order confirmed","order in process","order dispatched","oreder shipped","order delivered","order returned","order cancelled"];


var STATUS_OK=200;

var orders=[];
getStoredOrders();

function getStoredOrders()
{
    var request = new XMLHttpRequest(); 
    
     request.addEventListener('load', function() 
    {
      if (request.status === STATUS_OK) {
        orders = JSON.parse(request.responseText);
             // alert(orders.length);
          showOrders();
      }
      else
        alert("order receiving failed")   
    });
    
    request.open("GET", '/admin/getorders');
    request.send();
}


var main=document.getElementById("main");

function showOrders()
{
    for(var j=0;j<orders.length;j++)
        {
             fun(orders[j],j);
        }
}


function fun(order,index)
{
       var div=document.createElement("div");
            div.setAttribute("style","padding:12px 12px;display:block;border:1px solid crimson;height:30px");
            if(order.status==0)
                div.style.backgroundColor="antiquewhite";
            
            label1=createLabel(order._id,1);
            label2=createLabel(order.created,2);
            label3=createLabel(statuses[order.status],3);
            label4=createLabel(order.updated,4);
            label5=createLabel(order.address,5);
            label1.setAttribute("style","margin-left:15px");
            label2.setAttribute("style","margin-left:50px");
            label3.setAttribute("style","margin-left:50px");
            label4.setAttribute("style","margin-left:50px");
            label5.setAttribute("style","margin-left:50px");
            div.appendChild(label1);
            div.appendChild(label2);
            div.appendChild(label3);
            div.appendChild(label4);
            div.appendChild(label5);
    
    
    
            var remove=document.createElement("button");
            //remove.setAttribute("id",order._id);
            remove.setAttribute("style","float:right;paddding:10px 10px;border-radius:5px;background-color:crimson;color:white;margin-right:50px");
            remove.textContent="remove";
            div.appendChild(remove);
    
            var confirm=document.createElement("button");
            confirm.setAttribute("id",order.orderid);
            confirm.setAttribute("style","float:right;paddding:10px 10px;border-radius:5px;background-color:darkgreen;color:white;margin-right:50px");
            confirm.textContent="confirm";
            div.appendChild(confirm);
    alert(order.status)
              if(order.status>0)
             {
                 confirm.disabled=true;
                 confirm.textContent="Confirmed!";
                 confirm.style.backgroundColor="gray"
             }
              
            
            main.appendChild(div);
            remove.addEventListener("click", function(event) 
                   { 
                event.stopPropagation();
                //alert(remove.getAttribute("id"));
                      remove_fun(order._id,div);//orders[j].orderid,div
                   });
    
       
            confirm.addEventListener("click", function(event) 
                   { 
                
                 event.stopPropagation();
                
                       confirm_fun(order._id,div,event);
                   });
    
            
            div.addEventListener("mouseover", function(event) 
                   { 
                      div.style.backgroundColor="white";
        
                   });
                
            div.addEventListener("mouseout", function(event) 
                   { 
                      div.style.backgroundColor="antiquewhite";
        
                   });
    
             div.addEventListener("click", function(event) 
                   { 
                        var request = new XMLHttpRequest(); 
    
                           request.addEventListener('load', function() 
                          {
                            if (request.status === STATUS_OK) {
                              document.location.href = "seedetails.html";
                            }
                            else
                              alert("order opening failed")   
                          });
                          
                          request.open("POST", '/admin/openorderdetail');
                          request.setRequestHeader("Content-type", "application/json");
                          request.send(JSON.stringify({orderid:order._id}));                  

                   });
             
}


function createLabel(data,flag)
{
    label=document.createElement("label");
    if(flag==1)
        text="#"+data;
    else if(flag==2)
        text="Dated:"+data;
    else if(flag==3)
        text="Status:"+data;
    else if(flag==4)
        text="Updated:"+data;
    else
        text="Address:"+data;
    textnode=document.createTextNode(text);
    label.appendChild(textnode);
    return label;
}


function confirm_fun(orderid,div,event)
{
    confirm_order(orderid,function(){
        var status=div.childNodes[2];
        status.textContent="Status : "+statuses[1];
        div.childNodes[3].textContent="Updated:"+Date.now();
        event.target.style.backgroundColor="gray";
        event.target.disabled=true;
        event.target.textContent="confirmed!";
    });    
}

function confirm_order(orderid,callback)
{
    var request=new XMLHttpRequest();
     request.addEventListener('load', function() 
	  {
		if (request.status === STATUS_OK) {
		     callback();    
		}
         else
           alert("order not confirm");
	  });

	  request.open('POST', '/admin/changeorderstatus');
      request.setRequestHeader("Content-type", "application/json");
	  request.send(JSON.stringify({orderid:orderid,status:1}));
}

function remove_order(orderid,callback)
{
    var request=new XMLHttpRequest();
     request.addEventListener('load', function() 
	  {
		if (request.status === STATUS_OK) {
		     callback();    
		}
         else
           alert("order not removed");
	  });

	  request.open('POST', '/admin/removeorder');
      request.setRequestHeader("Content-type", "application/json");
	  request.send(JSON.stringify({orderid:orderid}));
}

function remove_fun(orderid,div)
{
    remove_order(orderid,function(){
       while(div.firstChild)
        {
            div.removeChild(div.firstChild);
        }
       div.parentNode.removeChild(div); 
    });
       
}



////////////////////






function storeOpenedOrder(opened_order) 
{
    sessionStorage.opened_order = JSON.stringify(opened_order);
}






