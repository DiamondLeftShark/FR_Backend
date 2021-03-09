/*handles variables for data storage and the function calls required to access and modify the data.
For purposes of exercise, this transaction data is stored in memory and will be cleared on any server restart.
This code also assumes that all transactions conducted/points spent belong to the same user.
*/
const sqlite = require('sqlite3').verbose();
const sampleData = require('./sample_data.js');
const schema = require('./schema.js');

//variable declarations
//testing functionality: when true, after initializing DB populates transaction table with transactions listed in sample_data.js.
const useSampleData = true;
//console.log(sampleData.sampleData);
//console.log(schema.schema);

//initialize DB on startup
const db = new sqlite.Database(':memory:', (err) => {
  if(err) {
    console.log("ERROR: COULD NOT INITIALIZE DB");
    console.log(err);
  } else {
    console.log("SQLite database initialized in memory");
    db.run(schema.schema, (err) => {
      if(err) {
        console.log("ERROR CREATING TRANSACTION TABLE");
        console.log(err);
      } else {
        console.log("Transaction table created.");
        //TBD: load sample data into table if useSampleData set to true
      }
    });
  }
});

//function declarations
/*add transaction to transactionList.  Transactions should be stored/received in the following format:
 {"payer": string,
  "points": int,
  "timestamp": date}
  Points can be either positive or negative, with negative equating to points spent.  If no/invalid timestamp, use current time for timestamp.
*/
const addTransaction = function() {
  return 1;
}

/*Spend the specified number of points and return an array of payers and the points dedcuted from each payer's balance:
  [
    {"payer": string,
     "points": int},
     {...},
     ...
  ]
  Points should be deducted from oldest transactions (by timestamp) first.
*/
const spendPoints = function() {
  return 1;
}

/*calculate balance for each payer and return in the following format:
  {"payer": string,
   "points": int}

   No payer should have negative points.
*/
const getBalance = function() {
  return 1;
}

//helper function: list transactions currently in memory.
const listTransactions = function() {
  return 1;
}

module.exports.addTransaction = addTransaction;
module.exports.spendPoints = spendPoints;
module.exports.getBalance = getBalance;
module.exports.listTransactions = listTransactions;