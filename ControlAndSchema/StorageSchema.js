// =========================================================================================
// StorageSchema.js
// Author: Aditya Jalgaonkar
// Summary:
// This file defines the schema for the testResult/testRun record which is stored in the DB
// =========================================================================================

var mongoose = require('mongoose');  
var testRunSchema = new mongoose.Schema({
  name: 
  {
      type : String,
      required: true,
      enum : ['testSuite1', 'testSuite2', 'testSuite3', 'testSuite4', 'testSuite5', 'testSuite6', 'testSuite7', 'testSuite8'],
  },
  testRunOutput: String,
  status: 
  {
    type: String,
    required: true,
    enum: ['InProgress', 'Completed', 'Failed' ,'Canceled']
  },
  startTime: 
  {
    type: Date,
    default: Date.now
  },
  runtime:
  {
    type: Number,
    default: 0
  },
  exception: String
});
mongoose.model('TestRun', testRunSchema);
module.exports = mongoose.model('TestRun');