/*handles variables for data storage and the function calls required to access and modify the data.
For purposes of exercise, this transaction data is stored in memory and will be cleared on any server restart.
This code also assumes that all transactions conducted/points spent belong to the same user.
*/
const sqlite = require('sqlite3').verbose();
const sampleData = require('./sample_data.js');
const schema = require('./schema.js');

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
        initializeSampleData();
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
const addTransaction = function(transaction, callback) {
  console.log(transaction);

  if(transaction.points === 0) {
    //if points = 0, return null
    callback(null);
  } else if(transaction.points > 0) {
    //if points > 0, add transaction to table
    let query = `INSERT INTO transactions(payer, timestamp, points)
                 VALUES('${transaction.payer}', '${transaction.timestamp}', ${transaction.points});`;

    db.run(query, (err) =>{
      if(err) {
        console.log("Error inserting record into table");
        console.log(err);
        callback(null);
      } else {
        console.log("Transaction added successfully.");
        callback("Transaction added to table.");
      }
    });

  } else if(transaction.points < 0) {
    //if points < 0, TBD (check for valid transaction here, or in spendPoints?)

  } else {
    callback(null);
  }
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
const spendPoints = function(points, callback) {
  return 1;
}

/*calculate balance for each payer and return in the following format:
  {"payer": string,
   "points": int}

   No payer should have negative points.
*/
const getBalance = function(callback) {
  return 1;
}

//helper function: list transactions currently in memory.
const listTransactions = function(callback) {
  db.all('select * from transactions order by tranID', (err, rows) => {
    if(err) {
      console.log("Error listing transactions.");
      console.log(err);
    } else {
      console.log(rows);
    }
  });
}

//TBD: load sample data
function initializeSampleData() {
  if(useSampleData) {
    console.log("Loading sample data into table...");
    for(let i = 0; i < sampleData.sampleData.length; i++) {
      addTransaction(sampleData.sampleData[i], (res) => {
        if(res === null) {
          console.log(`Error loading sample record ${i}`);
        } else {
          console.log(`Sample record ${i} loaded`);
        }
      });
    }
    listTransactions();
  }
}

module.exports.addTransaction = addTransaction;
module.exports.spendPoints = spendPoints;
module.exports.getBalance = getBalance;
module.exports.listTransactions = listTransactions;