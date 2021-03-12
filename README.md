## About

This program was built as a solution for the Fetch Rewards coding prompt described here: https://fetch-hiring.s3.us-east-1.amazonaws.com/points.pdf

## Assumptions and Notes

1. All transactions are assumbed to be for the same user, so this code has no validation/checking for multiple users.

2. Beyond checking for necessary information (e.g. that API requests are in the expected format with the expected fields, checking for point balance before approving transactions), this program assumes any required validation has been performed elsewhere: in other words, if it comes in via the API in the correct format, it is assumed to be a valid transaction with relatively clean inputs (e.g. no non-integer values in the points fields).

3. Some console log statements have been included as a way to track what the program is doing via the terminal when performing/serving requests, though any API requests that expect data from the response as listed in the requirements should still receive it.

4. Test data and API calls are included in this code for the sake of validation/clarity: these can be enabled or disabled with useSampleData in database/database.js and enableTestAPIs in server/index.js respectively.

## Installation and Setup

This program runs in Node and uses Node Package Manager (NPM) to automatically download and install any required dependencies.  After downloading this repo:

1. Install Node/NPM at https://www.npmjs.com/get-npm (if they are not already installed).
2. Navigate to this repo's root directory (the directory with package.json) and run the following command:

```
npm install
```

This should download and install all required packages and dependencies.

3. Once installed, the program can be started using the following command:

```
npm run start-prod
```

If successful, you will see a notification that the program is listening for requests on localhost:3000.  The port number can be changed as needed by using the port variable in server/index.js and restarting the program.

## Routes

* ```/balance```
Check the  available point balance for all payers currently in the database.

API type: GET

Required parameters: none

Response: If successful, returns a JSON list of payers in the following format:

```
[
  {'payer': string,
   'points': int}
]
```
On error: returns 500

* ```/transaction```
Adds the provided transaction to the table.

API type: POST

Required parameters:
```
{'payer': string,
 'points': int,
 'timestamp': date
}
```

Note that only one transaction may be sent at a time: if multiple transactions are received in the same POST, only the first one will be processed.  The payer and points fields are required, and points must also be a non-zero value.  Negative point values are accepted and will be deducted from the appropriate payer balance if available, but /transaction assumes any necessary accounting has been performed elsewhere and can result in issues if the negative points exceed the current payer's remaining balance: use /spend instead unless otherwise required.

If no timestamp is provided, the system will use the current time for the transaction.

Response: If successful, returns 200.

On error: returns 500.

*```/spend```
Spends the requsted number of points if available and updates the transaction table with the spending information and returns a listing of points spent per payer.

API type: POST

Required parameters:
```
{'points': int}
```

Points per payee will be determined by deducting remaining unspent points sorted by earliest transaction first.  Points will not be spent if the points value provided in the API request exceeds the current remaining balance.

Response: If successful, returns 200 and returns a list of points spent by payee in the following format:
```
[
{'payer': string,
'points': int},
...
]
```

On error: returns 500.