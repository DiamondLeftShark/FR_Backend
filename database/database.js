/*handles variables for data storage and the function calls required to access and modify the data.
For purposes of exercise, this transaction data is stored in memory and will be cleared on any server restart.
This code also assumes that all transactions conducted/points spent belong to the same user.
*/
const sqlite = require('sqlite3').verbose();
const moment = require('moment');
const sampleData = require('./sample_data.js');
const schema = require('./schema.js');

//when true, after initializing DB populates transaction table with transactions listed in sample_data.js.
const useSampleData = true;

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

/*-------------------
Function Declarations
-------------------*/

/*calculate balance for each payer and return in the following format:
  {"payer": string,
   "points": int}
   No payer should have negative points.
*/
const getBalance = function(callback) {
  let query = `SELECT PAYER, SUM(points) as points from transactions
              group by payer;`;
  db.all(query, (err, rows) => {
    if(err) {
      console.log("Error calculating payer balance");
      console.log(err);
      callback(null);
    } else {
      console.log(rows);
      callback(rows);
    }
  });
  return 1;
}

//helper function: calculates and returns total points for all transactions
const getTotalBalance = function(callback) {
  let query = 'SELECT SUM(points) AS totalBalance from transactions;';
  db.all(query, (err, rows) => {
    if(err) {
      console.log("Error calculating total balance for all transactions.");
      console.log(err);
      callback(null);
    } else {
      console.log(rows[0].totalBalance);
      callback(rows[0].totalBalance);
    }
  });
}

/*add transaction to transactionList.  Transactions should be received in the following format:
 {"payer": string,
  "points": int,
  "timestamp": date}
  Points can be either positive or negative, with negative equating to points spent.  If no/invalid timestamp, use current time for timestamp.
  For transactions with negative points, this function assumes balance checking has been done elsewhere (e.g. spendPoints): use spendPoints unless otherwise necessary.
*/
const addTransaction = function(transaction, callback) {
  console.log("Trnsaction received: ");
  console.log(transaction);

  let payer = transaction.payer;
  let points = transaction.points;
  let timestamp = transaction.timestamp;

  //use current datetime if timestamp not provided
  if(timestamp === null || timestamp === undefined) {
    timestamp = moment().format('YYYY-MM-DD[T]HH:MM:SS[Z]');
  }

  if(payer === undefined || points === undefined) {
    callback(null);

  } else if(points === 0) {
    callback(null);

  } else if(points > 0) {
    //if points > 0, add transaction to table
    let query = `INSERT INTO transactions(payer, timestamp, points)
                 VALUES('${payer}', '${timestamp}', ${points});`;

    db.run(query, (err) =>{
      if(err) {
        console.log("Error inserting record into table");
        console.log(err);
        callback(null);
      } else {
        console.log("Transaction added successfully.");
        callback("Transaction added successfully.");
      }
    });

  } else if(points < 0) {
    /*TBD:
      1. Add spending transaction to table.
      2. Update spentPoints for each positive transaction from the given payer until in balance.  Points should be spent using oldest available first.
    */
    db.serialize(() => {
      let insertQuery = `INSERT INTO transactions(payer, timestamp, points)
                 VALUES('${payer}', '${timestamp}', ${points});`;

      console.log(insertQuery);

      db.run(insertQuery, (err) => {
        if(err) {
          console.log("Error inserting spend transaction");
          console.log(err);
          callback(null);
        } else {
          console.log("Spending transaction added, updating spentPoints...");

          let sql = `select * from transactions
                 where points > 0
                 AND spentPoints < points
                 AND payer = "${payer}"
                 order by timestamp;`;

          //TBD: complete rest of logic
          db.all(sql, (err, rows) => {
            if(err) {
              console.log("Error getting transactions with unspent points.");
              console.log(err);
              callback(null);

            } else {
              console.log(rows);
              console.log('^^^^^^^');
              let totalPointsToSpend = points * -1;

              for(i = 0; i < rows.length; i++) {
                let tranID = rows[i].tranID;

                if(totalPointsToSpend > 0) {
                  let remainingPoints = rows[i].points - rows[i].spentPoints;

                  if(totalPointsToSpend >= remainingPoints) {

                    let spendPointsQuery = `UPDATE transactions
                                            set spentPoints = spentPoints + ${remainingPoints}
                                            where tranID = ${tranID};`
                    db.run(spendPointsQuery, (err) => {
                      if(err) {
                        console.log(`Error updating spent points for tranID ${tranID}: check transaction table.`);
                      } else {
                        console.log(`TranID ${tranID} updated.`);
                      }

                    });

                    totalPointsToSpend -= remainingPoints;

                  } else {
                    let spendPointsQuery = `UPDATE transactions
                                            set spentPoints = spentPoints + ${totalPointsToSpend}
                                            where tranID = ${tranID};`
                    db.run(spendPointsQuery, (err) => {
                      if(err) {
                        console.log(`Error updating spent points for tranID ${tranID}: check transaction table.`);
                      } else {
                        console.log(`TranID ${tranID} updated.`);
                      }

                    });

                    totalPointsToSpend -= totalPointsToSpend;
                  }
                }
              }
            }
          });

          callback("Spending transaction loaded into table.");
        }

      });

    });

  } else {
    //catch-all for edge cases not specified
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
  console.log(`Spending ${points} points...`);

  let payerList = {};
  let currentPointsSpent = 0;

  //check if points <= total balance
  getTotalBalance((totalBalance) => {
    if(totalBalance === null) {
      console.log("Error calculating current balance.");
      callback(null);

    } else if(totalBalance < points) {
      //if points spent exceed remaining balance, return an error
      console.log(`Error: attempting to spend ${points} points but only ${totalBalance} points available.`);
      callback(null);

    } else {
       //otherwise, check which transactions have a remaining points balance and deduct from each payer until all points have been deducted
       //add appropriate transactions to each table deducting points from each payer as needed
       //after all transactions have been added, return a list of points spent for each payer to the callback function

      let sql = `select * from transactions
                 where points > 0
                 AND spentPoints < points
                 order by timestamp;`;

      db.all(sql, (err, rows) => {
          if(err) {
            console.log(err);
            callback(null);
          } else {
            console.log(rows);
            console.log('************');

            for(let i = 0; i < rows.length; i++) {
              //console.log(`Current points spent: ${currentPointsSpent} out of ${points} before row ${i}`);
              console.log(rows[i]);

              if(currentPointsSpent < points) {
                let remainingPointsForRow = rows[i].points - rows[i].spentPoints;
                if(points - currentPointsSpent >= remainingPointsForRow) {
                  (payerList[rows[i].payer] === undefined) ? (payerList[rows[i].payer] = remainingPointsForRow) : (payerList[rows[i].payer] += remainingPointsForRow);
                  currentPointsSpent += remainingPointsForRow;
                } else {
                  (payerList[rows[i].payer] === undefined) ? (payerList[rows[i].payer] = points - currentPointsSpent) : (payerList[rows[i].payer] += points - currentPointsSpent);
                  currentPointsSpent += points - currentPointsSpent;
                }

              }

              console.log(`Current points spent: ${currentPointsSpent} out of ${points} after row ${i}`);
              console.log(payerList);

            }

            /*TBD: At this point, should have all points spent for each payer.  Now:
            1. Add a new (spending) transaction to the table for each payer using addTransaction().  addTransaction will need to both add the transaction, as well as
               update the necessary transactions with the correct spendPoints value.
            2. Once all spending transactions have been added, send the payerList to the callback.  The payerList will need to be converted to an array of objects
              {"payer": string, "points": int}, but this can be handled either in DB or server code.
            */
            for(payer in payerList) {
              let negativePoints = payerList[payer] * -1;

              let spendTransaction = { "payer": payer,
                                       "points": negativePoints,
                                       "timestamp":  moment().format('YYYY-MM-DD[T]HH:MM:SS[Z]')
                                     };

              console.log("Adding following transaction to transaction table: ");
              console.log(spendTransaction);
              //TBD: remaining code: add addTransaction handling here
              addTransaction(spendTransaction, (output) => {
                if(output === null) {
                  console.log("Error adding transaction");
                  callback(null);
                } else {
                  console.log(`Transaction for ${payer} added successfully.`);
                }

              });

            }

          }
      });

    }
  })

}



//helper function: list transactions currently in memory.
const listTransactions = function(callback) {
  db.all('select * from transactions order by timestamp', (err, rows) => {
    if(err) {
      console.log("Error listing transactions.");
      console.log(err);
      callback(null);
    } else {
      console.log(rows);
      callback(rows);
    }
  });
}

//helper function: loads sample data from sample_data.js into table.
function initializeSampleData() {
  if(useSampleData) {

    console.log("Loading sample data into table...");

    db.serialize(() => {
      for(let i = 0; i < sampleData.sampleData.length; i++) {
        addTransaction(sampleData.sampleData[i], (res) => {
          if(res === null) {
            console.log(`Error loading sample record ${i}`);
          } else {
            console.log(`Sample record ${i} loaded`);
          }
        });
      }

      listTransactions((rows) => {
        if(rows !== null) {
          console.log(`Total balance of sample transactions:`);
          getBalance((result) => {
            if(result !== null) {
              console.log(`---------------------------------`);
            }
          });
        }
      });

  });

  }
}

module.exports.addTransaction = addTransaction;
module.exports.spendPoints = spendPoints;
module.exports.getBalance = getBalance;
module.exports.listTransactions = listTransactions;