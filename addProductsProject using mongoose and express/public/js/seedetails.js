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


getOpenedOrder();

function getOpenedOrder()
{
    var request = new XMLHttpRequest();
    
     request.addEventListener('load', function() 
    {
      if (request.status === STATUS_OK) {
        order = JSON.parse(request.responseText);
              //alert(cartproducts.length);
          showOrder(order);
          display_details(order.data);
      }
    });
    
    request.open("GET", '/admin/get_openedorder_detail');
    request.send();
}


var main=document.getElementById("main");




function showOrder(order)
{
       var div=document.createElement("div");
            div.setAttribute("style","padding:12px 12px;display:block;height:30px");
 
            alert('in show '+order.status)
            label1=createLabel(order._id,1);
            label2=createLabel(order.created,2);
            label3=createLabel(statuses[order.status],3);
            label4=createLabel(order.updated,4);
            label5=createLabel(order.address,5);
            label6=createLabel(order.username,6);
            label7=createLabel(order.email,7);
    
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
    
            label3.setAttribute("id",order._id);
 
    
    var confirm=document.createElement("button");
            //confirm.setAttribute("id",order.orderid);
            confirm.setAttribute("style",";paddding:20px 20px;border-radius:8px;background-color:darkgreen;color:white;margin-left:50px;font-size:17px");
            confirm.textContent="confirm";
            div.appendChild(confirm);
    
    
     var remove=document.createElement("button");
            //remove.setAttribute("id",order.orderid);
            remove.setAttribute("style",";paddding:10px 10px;border-radius:8px;background-color:crimson;color:white;margin-left:25px;font-size:17px");
            remove.textContent="remove";
            div.appendChild(remove);
    
    
    main.appendChild(div);
    breakLine=getBreakLine();
    div.appendChild(breakLine);
    breakLine=getBreakLine();
    div.appendChild(breakLine);
    
    div.appendChild(label6);
    div.appendChild(label7);
    
    var breakLine=document.createElement("br");
    main.appendChild(breakLine);
    var breakLine=document.createElement("br");
    main.appendChild(breakLine);
    var breakLine=document.createElement("br");
    main.appendChild(breakLine);
    
    
     if(order.status>0)
    {
        confirm.disabled=true;
        confirm.textContent="Confirmed!";
        confirm.style.backgroundColor="gray";
        show_dropdown(order,div);
    }
    
    
        remove.addEventListener("click", function(event) { 
                      remove_fun(order._id);//orders[j].orderid,div    
            });
    
         confirm.addEventListener("click", function(event) { 
                       confirm_fun(order._id,div,event,function(){
                          order.status=1;
                       show_dropdown(order,div); 
                   });   
                });
              
             
}

function remove_fun(orderid)
{
    remove_order(orderid,function(){
        document.location.href="home.html";
    });
       
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


function confirm_fun(orderid,div,event,callback)
{
    confirm_order(orderid,function(){
        var status=div.childNodes[2];
        status.textContent="Status : "+statuses[1];
        div.childNodes[3].textContent="Updated:"+Date.now();
        event.target.style.backgroundColor="gray";
        event.target.disabled=true;
        event.target.textContent="confirmed!";
        
        callback();
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



function show_dropdown(order,statusdiv)
{
    alert('in drop '+order.status)
    var div=document.createElement("div");
    label=document.createElement("label");
    label.textContent="Change Status : ";
    label.setAttribute("style","margin-left:250px;font-size:20px;color:darkred;float:left");
    var dropdown=document.createElement("select");
    
    dropdown.setAttribute("style","margin-left:40px;float:left;background-color:antiquewhite;border:2px solid crimson;color:black;padding 20 px 20px;width:150px;border-radius:6px;height:30px");
    //dropdown.setAttribute("id",pdt.id);
    addin_dropdown(dropdown,order.status);
    
    var update=document.createElement("button");
    update.textContent="update";
    update.setAttribute("style",";paddding:20px 20px;border-radius:5px;background-color:darkgreen;color:white;margin-left:50px;font-size:17px");
      
    main.appendChild(div);
    div.appendChild(label);
    div.appendChild(dropdown);
    div.appendChild(update);
    
    
    update.addEventListener("click", function(event) 
     { 
        console.log(order);
        status=getStatus(dropdown.value);
        update_fun(statusdiv,order,status,dropdown)
     });
}


function addin_dropdown(dropdown,status)
{

    for(var j=status;j<statuses.length;j++)
        {
           var op=document.createElement("option");
           op.text=statuses[j];
           dropdown.appendChild(op);
        }
}


function update_fun(div,order,status,dropdown)
{
    update_status(order._id,status,function(){ 
        //alert(status);
        order.status=status;
        div.childNodes[2].textContent="Status : "+statuses[status];
        div.childNodes[3].textContent="Updated:"+Date.now();
        
        while(dropdown.firstChild && dropdown.firstChild.value!=statuses[status])
            dropdown.removeChild(dropdown.firstChild);
    });
    
}

function update_status(orderid,status,callback)
{
    alert('in update'+status)
    var request=new XMLHttpRequest();
     request.addEventListener('load', function() 
	  {
		if (request.status === STATUS_OK) {
		     callback();
		}
        else
        alert("order status not updated");
	  });

	  request.open('POST', '/admin/changeorderstatus');
      request.setRequestHeader("Content-type", "application/json");
    alert({orderid:orderid,status:parseInt(status)})
    console.log({orderid:orderid,status:parseInt(status)})
	  request.send(JSON.stringify({orderid:orderid,status:parseInt(status)}));
}

function getStatus(status)
{
    for(var i=0;i<statuses.length;i++)
        {
            if(statuses[i]==status)
                return i;
        }
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
    else if(flag==5)
        text="Address:"+data;
    else if(flag==6)
        text="Name : "+data;
    else if(flag==7)
        text="Email : "+data;
    textnode=document.createTextNode(text);
    label.appendChild(textnode);
    
    label.setAttribute("style","margin-left:50px;font-size:20px");
    return label;
}


function getBreakLine()
{
    var br=document.createElement("br");
    //br.setAttribute("style","clear:both");
    return br;
}




////////////////      detail display part


var disp=document.getElementById("details_div");   


function display_details(arr)
{
    
       div=document.createElement("div");
           for(var j=0;j<5;j++)
                {
                    var subdiv=document.createElement("div");
                    subdiv.setAttribute("style","float:left;margin-left:50px;width:150px;color:darkred;text-decoration:underline");
                    if(j==0)
                        subdiv.textContent="NAME";
                    else if(j==1)
                        subdiv.textContent="DESCRIPTION";
                    else if(j==2)
                        subdiv.textContent="QUANTITY BOUGHT";
                    else if(j==3)
                        subdiv.textContent="PRICE";
                    else if(j==4)
                        subdiv.textContent="SUBTOTAL";
                    
                    div.appendChild(subdiv);
                }
            breakline=document.createElement("br");
            //breakline.setAttribute("style","clear:both");
            div.appendChild(breakline);
            breakline=document.createElement("br");
            div.appendChild(breakline);
            breakline=document.createElement("br");
            div.appendChild(breakline);
    
            disp.appendChild(div);
    
    
    for(var i=0;i<arr.length;i++)
        {
            var div=document.createElement("div");
            disp.appendChild(div);
            
            for(var j=0;j<5;j++)
                {
                    var subdiv=document.createElement("div");
                    subdiv.setAttribute("style","float:left;margin-left:50px;width:150px");
                    if(j==0)
                        subdiv.textContent=arr[i].name;
                    else if(j==1)
                        subdiv.textContent="hello";  //arr[i].description
                    else if(j==2)
                        subdiv.textContent=arr[i].cquantity;
                    else if(j==3)
                        subdiv.textContent=arr[i].price;
                    else if(j==4)
                        subdiv.textContent=parseInt(arr[i].price)*parseInt(arr[i].cquantity);
                    
                    div.appendChild(subdiv);
                }
            breakline=document.createElement("br");
            //breakline.setAttribute("style","clear:both");
            div.appendChild(breakline);
            breakline=document.createElement("br");
            div.appendChild(breakline);
        }
}


///////////////


























