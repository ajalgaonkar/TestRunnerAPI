// =========================================================================================
// commandHelper.js
// Author: Aditya Jalgaonkar
// Summary:
// This file includes functions that will help run the testSuites defined 
// in the simpletestrunner.js provided for the exercise.
// =========================================================================================
var cmd = require('node-cmd');
var moment = require('moment');
var TestDB = require('./StorageFunctions');

module.exports = {
    // This function executes the testSuite but creating a process to run a cli
    // @testData is the DB record which is created for the test
    runTestSuite: function (testData)
    {
        // Runs the command the waits for the response
        cmd.get('node simpletestrunner.js '+ testData.name, 
        function(err, data, stderr) {
            TestDB.findTestRunByName(testData.name).then( function (testResult)
            {
                var testRun = testResult;
                // Only proceed if the test is InProgress (In case the test has been cancelled)
                if (testRun.status == 'InProgress')
                {
                    // Calculate the run time for the test with respect to when the test started.
                    testRun.runtime = moment(Date.now()).diff(testData.startTime, 'seconds');
                    
                    if (err) 
                    {
                        // Mark the testRun as Failed since the TestRun command failed (Something wrong with Test) 
                        testRun.status = 'Failed';
                        // Record the exception in the Result since this is potentially an error in the test code which is not handled
                        testRun.exception = err.message;
                    }
                    if (stderr)
                    {
                        // Mark the testRun as Failed since the TestRun command failed (Something wrong with Test) 
                        testRun.status = 'Failed';
                        // Log the exception in the Result since this is a exception caught while running the code.
                        testRun.exception = stderr;
                    }
                    if (data)
                    {
                        // Mark the testRun as completed (This marks the successful run for a testSuite)
                        testRun.status = 'Completed';
                        // Log the test output (if more details on the results are needed one can further parse the output here).
                        testRun.testRunOutput = data;
                    }
                    // Update the testSuite record
                    TestDB.updateTestRun(testRun).then(
                        function(result){
                            console.log("TestRun Completed \n" + result);
                    });
                }
            });
        });
    }
}