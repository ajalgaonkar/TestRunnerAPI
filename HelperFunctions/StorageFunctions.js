// =========================================================================================
// StorageFunctions.js
// Author: Aditya Jalgaonkar
// Summary:
// This file defines all functions necessary for performing actions on the StorageLayer
// =========================================================================================

var TestStore = require('../ControlAndSchema/StorageSchema');
module.exports = {
    // Creates a new TestRun for the given testSuite
    createTestResult : function (testSuiteName){
        return new Promise((resolve, reject) =>
        TestStore.create(
            {
                name : testSuiteName,
                testRunOutput : "",
                status : "InProgress",
                startTime : Date.now(),
                exception : "",
            }, 
            function (err, testSuite) {
                err ? reject(err) : resolve(testSuite);
            }
        ));
    },
    // Finds the TestRun by the given testSuiteName
    findTestRunByName : function (testSuiteName){
        return new Promise((resolve, reject) =>
        TestStore.findOne({name: testSuiteName},
            function (err, testSuite)
            {
                err ? reject(err) : resolve(testSuite);
            }
        ));
    },
    // Gets all TestRuns currently in the DB
    getAllTestRuns : function ()
    {
        return new Promise((resolve, reject) =>
        TestStore.find({},
            function (err, testSuites)
            {
                err ? reject(err) : resolve(testSuites);
            }
        ));
    },
    // Removes/Deletes a TestRun record
    removeTestRun : function (testId)
    {
        return new Promise((resolve, reject) =>
        TestStore.findByIdAndRemove(testId,
            function (err, testSuite)
            {
                err ? reject(err) : resolve(testSuite);
            }
        ));
    },
    // Update TestRun with new info
    updateTestRun: function(testRun)
    {
        return new Promise((resolve, reject) =>
        TestStore.findByIdAndUpdate(testRun.id, testRun, {new: true},
            function (err, testSuite)
            {
                err ? reject(err) : resolve(testSuite);
            }
        ));
    }
}