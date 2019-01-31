var products=[];
getStoredProducts();
var num=1;
var createformwindow=0;
var search_created=false;

var STATUS_OK=200;

var a1 = document.getElementById("add");


function start(products)
{
    if(products.length!=0)
    {
        num=products[products.length-1].id; 
        num=num+1;
    }
for(var c=0;c<products.length;c++)
    {
        addin_sidebar(products[c]);
    }
}

function getStoredProducts()
{
  var request = new XMLHttpRequest();
  
   request.addEventListener('load', function() 
  {
    if (request.status === STATUS_OK) {
      products = JSON.parse(request.responseText);
        
        start(products);
    }
  });
  request.open("GET", '/getproducts');
  request.send();
}

alert(products.length);






a1.addEventListener("click", function(event) {
				create_form("","","","",-1,0);
                a1.style.display="none";
});


function create_form(nm,desc,qnty,prc,idi,flag)
{
    createformwindow=1;
    //alert("flag="+flag);
    ////alert("hello");
    var pdtbox=document.getElementById("add_show_product_div");
    var div1 = document.createElement("div");
    var div2 = document.createElement("div");
    var div3 = document.createElement("div");
    var div4 = document.createElement("div");
    var div5 = document.createElement("div");
    div1.setAttribute("id","div1");
    div2.setAttribute("id","div2");
    div3.setAttribute("id","div3");
    div4.setAttribute("id","div4");
    div5.setAttribute("id","div5");

    var node1 = document.createElement("label");
    var node2 = document.createElement("input");
    node1.setAttribute("id","lbl1");
    node2.setAttribute("id","txt1");
    var textnode1 = document.createTextNode("Name:");
    node2.setAttribute("type","text"); 
    if(flag==1)
        node2.value=nm;
    node1.appendChild(textnode1); 
    div1.appendChild(node1);
    div1.appendChild(node2);
    pdtbox.appendChild(div1);
    
    var breakLine=document.createElement("br");
    div1.appendChild(breakLine);
    var breakLine=document.createElement("br");
    div1.appendChild(breakLine);
    
    var node1 = document.createElement("label");
    var node2 = document.createElement("textarea"); 
    node1.setAttribute("id","lbl2");
    node2.setAttribute("id","txt2");
    var textnode1 = document.createTextNode("Description:"); 
    node2.setAttribute("row","5");
	node2.setAttribute("col","-10");
    if(flag==1)
        node2.value=desc;
    node1.appendChild(textnode1); 
    div2.appendChild(node1);
    var breakLine=document.createElement("br");
    div2.appendChild(breakLine);
    div2.appendChild(node2);
    pdtbox.appendChild(div2);
    
    var breakLine=document.createElement("br");
    div2.appendChild(breakLine);
    var breakLine=document.createElement("br");
    div2.appendChild(breakLine);
    
    var node1 = document.createElement("label");
    var node2 = document.createElement("input");
    node1.setAttribute("id","lbl3");
    node2.setAttribute("id","txt3");
    var textnode1 = document.createTextNode("Quantity:");
    node2.setAttribute("type","text");
    if(flag==1)
        node2.value=qnty;
    node1.appendChild(textnode1);
    div3.appendChild(node1);
    div3.appendChild(node2);
    pdtbox.appendChild(div3);
    
    var breakLine=document.createElement("br");
    div3.appendChild(breakLine);
    var breakLine=document.createElement("br");
    div3.appendChild(breakLine);
    
    var node1 = document.createElement("label");
    var node2 = document.createElement("input");
    node1.setAttribute("id","lbl4");
    node2.setAttribute("id","txt4");
    var textnode1 = document.createTextNode("price:");
    node2.setAttribute("type","text");
    if(flag==1)
        node2.value=prc;
    node1.appendChild(textnode1);
    div4.appendChild(node1);
    div4.appendChild(node2);
    pdtbox.appendChild(div4);
    
    var breakLine=document.createElement("br");
    div4.appendChild(breakLine);
    var breakLine=document.createElement("br");
    div4.appendChild(breakLine);
    
    var submit_or_update = document.createElement("button");
    var cancel = document.createElement("button");
    if(flag==0)
    submit_or_update.innerHTML="submit";
    else
      submit_or_update.innerHTML="update" 
    
    submit_or_update.setAttribute("id","btn1");
    submit_or_update.setAttribute("style","background-color:green;padding:8px 15px ;color:white");
    
    cancel.innerHTML="cancel";
    cancel.setAttribute("id","btn2");
    cancel.setAttribute("style","background-color:darkorange;padding:8px 15px ;color:white;margin-left:10px");
    
    div5.appendChild(submit_or_update);
    div5.appendChild(cancel);
    pdtbox.appendChild(div5);
    
    var b1 = document.getElementById("btn1");
    var b2 = document.getElementById("btn2");

b1.addEventListener("click", function(event) 
    {
    alert("submit");
    check(idi,flag);
    });
b2.addEventListener("click", function(event) 
    {
    ////alert("welcome");
    createformwindow=0;
    close();
    });
}
  

    function check(idi,flag)
    {
        //alert("flag in check="+flag);
        var i1=document.getElementById("txt1");
        var i2=document.getElementById("txt2");
        var i3=document.getElementById("txt3");
        var i4=document.getElementById("txt4");
        //var flag=0;
        if(i1.parentNode.childNodes[2] && i1.parentNode.childNodes[2].getAttribute("class")=="error")
            i1.parentNode.removeChild(i1.parentNode.childNodes[2]);
        if(i2.parentNode.childNodes[3] && i2.parentNode.childNodes[3].getAttribute("class")=="error")
            i2.parentNode.removeChild(i2.parentNode.childNodes[3]);
        if(i3.parentNode.childNodes[2] && i3.parentNode.childNodes[2].getAttribute("class")=="error")
            i3.parentNode.removeChild(i3.parentNode.childNodes[2]);
        if(i4.parentNode.childNodes[2] && i4.parentNode.childNodes[2].getAttribute("class")=="error")
            i4.parentNode.removeChild(i4.parentNode.childNodes[2]);
        
        var messages=[];
        var letters = /^[A-Za-z]+$/;
        var numbers = /^[0-9]+$/;
        
        if(i1.value=="")
            {
                messages.push("field cannot be left empty");
            }
        else if(!(i1.value.match(letters)))
            {
                messages.push("only characters allowed");
            }
        else
            messages.push("clear");
        //////////////////
        
        if(i2.value=="")
            {
                messages.push("field cannot be left empty");
            }
        else
            messages.push("clear");
        //////////////
        
        if(i3.value=="")
            {
                messages.push("field cannot be left empty");
            }
        else if(!i3.value.match(numbers))
            {
                messages.push("only numbers allowed");
            }
        else
            messages.push("clear");
         //////////////
        
        if(i4.value=="")
            {
                messages.push("field cannot be left empty");
            }
        else if(!i4.value.match(numbers))
            {
                messages.push("only numbers allowed");
            }
        else
            messages.push("clear");
        
var cleared=1;
        for(var h=0;h<4;h++)
            {
                if(messages[h]!="clear")
                    {
                        cleared=0;
                        var error=document.createElement("label");
                        var text = document.createTextNode(messages[h]);
                        error.appendChild(text);
                        error.style.color="red";
                        error.setAttribute("class","error");
                        var divi;
                        if(h==0)
                          divi=document.getElementById("div1");
                        else if(h==1)
                          divi=document.getElementById("div2"); 
                        else if(h==2)
                          divi=document.getElementById("div3");
                        else if(h==3)
                          divi=document.getElementById("div4");
                       if(h!=1)//for description.because breakline is added as 2nd child in case of description
                      divi.insertBefore(error, divi.childNodes[2]); 
                        if(h==1)
                        divi.insertBefore(error, divi.childNodes[3]);    
                    }
            }
        //alert("flag="+flag);
        if(cleared==1 && flag==0)
            {
                alert("adding");
                add();
            }
        else if(cleared==1 && flag==1)
            {
                alert("going to update");
                update(idi);
            }
        else
            alert("please fill correctly the mentioned columns");
        
        ////alert("hello");
    }


    function close()
    {
        //////alert("close");
        var text="div";
        var main=document.getElementById("add_show_product_div");
        for(var i=1;i<=4;i++)
            {
                var p=text+i;
                var element = document.getElementById("div"+i);
                //////alert(p);
               
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
                main.removeChild(main.firstChild);
            }
        var element = document.getElementById("div5");
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
               // main.removeChild(main.childNodes[4]);
        
        var a=document.getElementById("add");
        a.style.display="block";
        a.style.marginTop= "100px";
        
    }

   function storeProducts()
    {
        localStorage.products = JSON.stringify(products);
    }

    
    function update(id)
    {
         var i1=document.getElementById("txt1");
        var i2=document.getElementById("txt2");
        var i3=document.getElementById("txt3");
        var i4=document.getElementById("txt4");
        
        var ob=addp(id,i1.value,i2.value,i3.value,i4.value);
        update_inProducts(ob,function(){
            
            var mdiv=document.getElementById(id);
           for(var j=0;j<products.length;j++)
            {
                if(id==products[j].id)
                   products[j]=ob;
            }

            var s=(ob.id+"<ul><li>"+ob.name+"</li><li>"+ob.description+"</li><li>"+"Price:"+ob.price+"</li><li>"+"Quantity:"+ob.quantity+"</li></ul>");
            ldiv=mdiv.firstChild;
            ldiv.innerHTML=s;
            close();
            createformwindow=0;
        });
        
    }


    function add()
    {
        //////alert("in add");
        ////alert(products.size);
        var i1=document.getElementById("txt1");
        var i2=document.getElementById("txt2");
        var i3=document.getElementById("txt3");
        var i4=document.getElementById("txt4");
        
        var ob=addp(num,i1.value,i2.value,i3.value,i4.value);
        
        add_inProducts(ob,function(){
            products.push(ob);
            addin_sidebar(ob);
            num=num+1;
        });
        
    }



    function addp(i,n,d,q,p)                         /// object
    {
        return pdt={
            id:parseInt(i),
            name:n,
            description:d,
            quantity:q,
            price:p
        }
    }


function add_inProducts(ob,callback)
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

	  request.open('POST', '/addproduct');
	  request.send(JSON.stringify(ob));
}


function update_inProducts(ob,callback)
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

	  request.open('POST', '/updateproduct');
	  request.send(JSON.stringify(ob));
}

    
      function addin_sidebar(ob)                          // add in sidebar
      {
          var side=document .getElementById("show");
         
          var mdiv=document.createElement("div");//main div
          var ldiv=document.createElement("div");//list div
          var ddiv=document.createElement("div");//delete/update div
          var dbtn=document.createElement("button");//delete button
          var ubtn=document.createElement("button");//update button
          dbtn.innerHTML="delete";
          ubtn.innerHTML="update";
          dbtn.setAttribute("style","background-color:darkred;padding:8px 15px ;color:white");
          ubtn.setAttribute("style","background-color:darkgreen;padding:8px 15px ;color:white;margin-left:10px");
      
          ddiv.appendChild(dbtn);
          ddiv.appendChild(ubtn);
          //alert(ob.id);
          mdiv.setAttribute("id",ob.id);
          ldiv.setAttribute("float","left");
          ddiv.setAttribute("float","left");
          mdiv.appendChild(ldiv);
          mdiv.appendChild(ddiv);
           var s=(ob.id+"<ul><li>"+ob.name+"</li><li>"+ob.description+"</li><li>"+"Price:"+ob.price+"</li><li>"+"Quantity:"+ob.quantity+"</li></ul>");
           ldiv.innerHTML=s;
      
          side.appendChild(mdiv);
          
          dbtn.addEventListener("click", function(event) 
          {
          //alert("delete");
          deletepdt(dbtn.parentNode.parentNode);
          });
          
          ubtn.addEventListener("click", function(event) 
          {
              if(createformwindow==1)
              close();
              create_form(ob.name,ob.description,ob.quantity,ob.price,ob.id,1);
          });
          
            if(search_created==false)
          {
             // alert("hii");
              var search=document.createElement("input");
              search.setAttribute("type","text");
              search.setAttribute("id","txt_search");
              search.setAttribute("placeholder","search");
              
              side.insertBefore(search,side.childNodes[0]);
              search_created=true;
              
              search.addEventListener("keyup",function(event){
                          //alert(search.value);
                        view(search.value);
              });
          
          }
      }
      
      function view(data)                            ///search view
      {
          if(data=="")
          {
              unhide_alldiv();
              return;
          }
          else
              {
          for(var j=0;j<products.length;j++)
              {
                  if(!(products[j].name).startsWith(data))
                      {
                         id=products[j].id ;
                          hide_div(id);
                      }
                  else
                      {
                          id=products[j].id ;
                          unhide_div(id);
                      }
              }
              }
      }
      
      function hide_div(id)                               ///hide
      {
          var d=document.getElementById(id);
          d.style.display="none";
      }
      function unhide_div(id)
      {
          var d=document.getElementById(id);
          d.style.display="block";
      }
      function unhide_alldiv()
      {
           for(var j=0;j<products.length;j++)
               {
                   unhide_div(products[j].id);
               }
      }
      
      
      
      function deletepdt(parent)                       ///delete
      {
          var id=parseInt(parent.getAttribute("id"));
              
          delete_inProducts(id,function(){
              
              for(var j=0;j<products.length;j++)
              {
                  if(parseInt(products[j].id)==id)
                      {
                         products.splice(j,1);
                          break;
                      }
              }
       
            var d=document.getElementById(id);
              d.removeChild(d.firstChild);
              d.firstChild.removeChild(d.firstChild.firstChild);
              d.firstChild.removeChild(d.firstChild.firstChild);
              d.removeChild(d.firstChild);
              d.parentNode.removeChild(parent);
 
            if(products.length==0)
              {
                  d=document.getElementById("show");
                  d.removeChild(d.childNodes[0]);
                  search_created=false;
              }
          });
          
      }


    function delete_inProducts(id,callback)
    {
        var request = new XMLHttpRequest();
        
        request.addEventListener('load', function() 
                                {
            if (request.status === STATUS_OK) {
                flag=JSON.parse(request.responseText);
                if(flag==true)
                    callback(id);
                else
                    alert("deletion failed");
                
            }
        });
        
        request.open('POST', '/deleteproduct');
        request.send(id);
    }
      

    function printarray()
    {
        for(var c=0;c<products.length;c++)
            alert(products[c].name);
    }
    



















