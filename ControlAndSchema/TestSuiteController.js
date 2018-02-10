// =========================================================================================
// TestSuiteController.js
// Author: Aditya Jalgaonkar
// Summary:
// This is the controller for our service which defines the logic for all API calls
// =========================================================================================

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var moment = require('moment');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
// Include all the DB functions used to interact with the backend storage
var TestDB = require('../HelperFunctions/StorageFunctions');
// Include the command runner which will run the testSuites
var CommandRunner = require('../HelperFunctions/commandHelper');

// POST call to Schedule TestSuite by testSuite name
// Format Example: <http://localhost:3000/testRunner/ScheduleTestRun/testSuite1>
router.post('/ScheduleTestRun/:testSuiteName', function (req, res) {
    // Check if TestRun already exists
    TestDB.findTestRunByName(req.params.testSuiteName).then(
        function(result) {
            // If TestRun already exists remove the previous run record and start a new TestRun
            if(result){
                TestDB.removeTestRun(result.id).then(
                    function(result){
                        TestDB.createTestResult(req.params.testSuiteName).then(
                            function (result) {
                                CommandRunner.runTestSuite(result);
                                // Sends back the Scheduled TestRun (InProgress)
                                res.status(200).send(result);
                            },
                            function (reason){
                                // If any rejected return 500 with failure reason
                                res.status(500).send(reason);
                            }
                        );
                    }
                );
            }
            // If TestRun was never run before start a new TestRun
            else{
                TestDB.createTestResult(req.params.testSuiteName).then(
                    function(result){
                        CommandRunner.runTestSuite(result);
                        // Sends back the Scheduled TestRun (InProgress)
                        res.status(200).send(result);
                    },
                    function (reason){
                        // If any rejected return 500 with failure reason
                        res.status(500).send(reason);
                    });
            }
    },
    function(reason)
    {
        console.log('Error in Scheduling the TestSuite')
        res.status(200).send(reason);
    }
    );
});

// GET call to get "All" TestRun results which are InProgress/Completed/Failed/Canceled
// URI Example: <http://localhost:3000/testRunner/GetAllTestResults>
router.get('/GetAllTestResults', function (req, res) {
    TestDB.getAllTestRuns().then(
        function (testResults) {
            testResults.forEach(testRun => {
                // If TestRun InProgress calculate the runtime before sending the results
                if (testRun.status == 'InProgress'){
                    testRun.runtime = moment(Date.now()).diff(testRun.startTime, 'seconds');
                }
            });
            res.status(200).send(testResults);
        },
        function (reason)
        {
            res.status(500).send("There was a problem getting test Results:\n"+ reason);
        }
    );
});

// POST call to cancel a Scheduled TestSuite by testSuite name
// URI Example: <http://localhost:3000/testRunner/CancelTestRun/testSuite1>
router.post('/CancelTestRun/:testRunName', function (req, res) {
    // Find the TestRun provided in the request for cancellation
    TestDB.findTestRunByName(req.params.testRunName).then(
        function(testRun){
            // If TestRun is found cancel TestRun only if its status is InProgress.
            if (testRun)
            {
                if (testRun.status == 'InProgress')
                {
                    // Calculate the runtime from when the TestRun was started to point of cancellation 
                    testRun.runtime = moment(Date.now()).diff(testRun.startTime, 'seconds');
                    // Mark test status as Canceled
                    testRun.status = 'Canceled';
                    testRun.testRunOutput = 'TestRun has been Canceled';

                    TestDB.updateTestRun(testRun).then(
                        function(result){
                            // Returns the Success message with the TestSuite that was canceled 
                            res.status(200).send("TestRun Successfully Cancelled \n" + result);
                    });
                }
                else
                {
                    // If TestSuite is not in progress return message stating so
                    res.status(200).send("TestRun Not InProgress currently \n" + testRun);
                }
            }
            else
            {
                // If TestRun is not found then the given TestSuite Name was never run
                res.status(200).send(req.params.testRunName + " Not Run Yet");
            }
        }
    );
});

// GET call to get TestRun results for a given TestSuite
// URI Example: <http://localhost:3000/testRunner/TestRunResult/testSuite1>
router.get('/TestRunResult/:testSuiteName', function (req, res) {
    TestDB.findTestRunByName(req.params.testSuiteName).then(
        function(result){
            if (result)
            {
                // Calculate runTime before returning results if TestRun is InProgress
                if (result.status == 'InProgress'){
                result.runtime = moment(Date.now()).diff(result.startTime, 'seconds');
                }
                // Return the TestRun results 
                res.status(200).send(result);
            }
            else
            {
                // If TestRun is not found then the given TestSuite was never run
                res.status(200).send(req.params.testSuiteName + " Not Run Yet");
            }
        });
});

module.exports = router;