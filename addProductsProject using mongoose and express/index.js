var express=require('express');
var routes = require('./routes'); 

var app=express();

app.set('port',process.env.PORT||9000)
const port=app.get('port');

app.use( express.static(__dirname+'/public' ));


app.use('/', routes); 



app.listen(port,function(err)
             {
    if(err)
        {
            return console.log("something bad happened "+err);
        }
    console.log('server is listening on '+port);
    
});