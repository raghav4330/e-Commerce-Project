var mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/ProductsProject',{useCreateIndex: true, useNewUrlParser: true }, function (err) {
   if (err) throw err; 
   console.log('Successfully connected');

    });