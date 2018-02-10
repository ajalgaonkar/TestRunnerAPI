// =========================================================================================
// commandHelper.js
// Author: Aditya Jalgaonkar
// Summary:
// This file defines the connection to the backend storage (mongoDb in our case)
// =========================================================================================

// Using Mongo DB as the back end and mongoose to communicate with the storage
var mongoose = require('mongoose');

// Currently we are connecting to localhost since the instance of mongoDb for me is running on my machine and not the cloud 
// If you have a cloud instance please change the URI in the connection to reflect that and it should work the same.
mongoose.connect('mongodb://localhost:27017/testRuns').catch((error)=>{
    console.log(error)
})