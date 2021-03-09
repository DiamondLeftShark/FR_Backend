## About

This program was built as a solution for the Fetch Rewards coding prompt listed here: https://fetch-hiring.s3.us-east-1.amazonaws.com/points.pdf

## Assumptions and Notes

1. All transactions are for the same user, so this code has no validation/checking for multiple users.

2. Beyond checking for necessary information (e.g. that API requests are in the expected format, checking for point balance before approving transactions), this program assumes any required validation has been performed elsewhere: in other words, if it comes in via the API in the correct format, it is assumed to be a valid transaction.

3. Console log statements have been included as a way to track what the program is doing when performing/serving requests, though any API requests that expect data from the response should still receive it.

## Installation and Setup
This program runs in Node and uses Node Package Manager (NPM) to automatically download and check any required dependencies.  After downloading this repo:

1. Install Node/NPM at https://www.npmjs.com/get-npm (if they are not already installed).
2. Navigate to this repo's root directory (the directory with package.json) and run the following command:

```
npm install
```

This should install all required packages and dependencies.

3. Once installed, the program can be started using the following command:

```
npm run start-prod
```

If successful, you will see a notification that the program is listening for requests on localhost:3000.  The port number can be changed as needed by editing the port variable in server/index.js and restarting the program.

## Routes

TBD: all routes and expected parameters.

* ```/balance```
Check the  available point balance for all payers currently in the database.

API type: GET

Required parameters: none

Returns: A JSON list of payers in the following format:

```
[
  {'payer': string,
   'points': int}
]
```
