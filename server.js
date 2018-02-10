// =========================================================================================
// server.js
// Author: Aditya Jalgaonkar
// Summary:
// Add the router file and create a server to start listening on a port
// For this application the port used is 3000.
// =========================================================================================

var app = require('./app');
var port = process.env.port || 3000;

var server = app.listen(port, function(){
    console.log('TestRunner server listening on port ' + port);
})