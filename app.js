// =========================================================================================
// app.js
// Author: Aditya Jalgaonkar
// Summary:
// This file is used for configuring our service and binding controller
// =========================================================================================

// Using express lib for routing of the API
var express = require('express');
var app = express();
var db = require('./storageConnection');

// Attaching the controller which will handle all the routes
var TestController = require('./ControlAndSchema/TestSuiteController');

// This is the base URL that will be used to call into the API methods 
app.use('/TestRunner', TestController);

module.exports = app;