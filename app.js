var express = require('express');  // web server automation
var app = express();
var cmsport=5057;  // default port number! 

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*app.use( function( req, res, next ) {
    var template = req.path.split('/').pop();
    if( template=='' || (template.indexOf( "." ) >=0) ) {
        console.log( req.path );
        next();
    }
    else {
        res.render( template, { title : template } );
    }
});*/
app.use( 
    express.static('.')
);

app.listen(cmsport); //the port you want to use
console.log( "app listening on port "+cmsport );