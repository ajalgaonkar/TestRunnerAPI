# TestRunnerAPI
For running the application please ensure you have the following
* Node js (https://nodejs.org/) 
* API calling tool like PostMan (https://www.getpostman.com/)
* MongoDB Community Edition. Here is the windows installation and running instructions (https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
* Optional but good to have: MongoDB Compass (https://docs.mongodb.com/compass/current/)

Once you have the above to run the service:
* Start the local instance of MongoDB. Once running it will start listening on port 27017 for any connections.
* Navigate to the project folder and run the following command `npm install`. This will get all the packages that you need for running the project.
* Once you have all the packages, from the project folder run the following command `node .\server.js`.
* If everything is good you will see the following on the console `TestRunner server listening on port 3000`

![Alt text](ScreenShots/RunningServer.png?raw=true "Server Console")

The above is an indication that your server is running and is now listening on port 3000.

The following are the API calls which perform the given actions:
* POST: Schedule TestSuite by testSuite name `/testRunner/ScheduleTestRun/<testSuiteName>`
* POST: Cancel a Scheduled TestSuite by testSuite name `/testRunner/CancelTestRun/<testSuiteName>`
* GET: Retrive TestRun results for a given TestSuite name `/testRunner/TestRunResult/<testSuiteName>`
* GET: "All" TestRun results `/testRunner/ScheduleTestRun/GetAllTestResults`

Since we are running the server locally the current URI to call is formatted in the following way:
</br>
htt&#8203;p://localhost:3000/testRunner/TestRunResult/testSuite1

Here is an example of calling the API through Postman:
![Alt text](ScreenShots/PostManTestForAPI.png?raw=true "Postman API Call")

Once the TestSuite is scheduled you can use MongoDB Compass to check the DB if the record was created:
![Alt text](ScreenShots/MongoDbCompass.png?raw=true "MongoDb Compass")
** For this you will need to connect to your local instance with the above port number 27017 **

NOTE:
The following are the assumptions for the solution:
* A TestSuite is considered `'InProgress'` if the simpletestrunner.js cli command is still running the testSuite
* When requesting output the following are provided:
  * TestSuite Name
  * RunTime of TestRun
  * Status of TestRun which can be [`'InProgress'`, `'Completed'`, `'Failed'` ,`'Canceled'`]
  * Output for Test which includes `Tests Failure Reason` and `Pass\Fail count`
  * Exception for TestRun. This is populated when TestRun encounters an unhandeled issue and throws and exception. In this scenario the TestRun Status will be `Failed`
* Canceling an test run will not contain any output of the testrun, but will provide runtime of the test.
* Currently the API expects only the given testSuites in its call (Note this is case sensitive and the example given on the exercise will not work when run against the simpletestrunner.js as mentioned). So if any other testSuite name is provides which is not through 
`testSuite1` through `testSuite8` and appropriate error mesage is sent back with a 500 on the response.
