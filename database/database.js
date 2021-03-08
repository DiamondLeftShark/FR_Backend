/*handles variables for data storage and the function calls required to access and modify the data.
For purposes of exercise, this transaction data is stored in memory and will be cleared on any server restart.
*/

//library declarations

//variable declarations
//TBD: store balance in a separate variable, or calculate as needed?
const transactionList = [];

//function declarations

/*add transaction to transactionList.  Transactions should be stored/received in the following format:
 {"payer": string,
  "points": int,
  "timestamp": date}
  Points can be either positive or negative, with negative equating to points spent.
*/
function addTransaction() {

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
function spendPoints() {

}

/*calculate balance for each payer and return in the following format:
  {"payer": string,
   "points": int}

   No payer should have negative points.
*/
function getBalance() {

}

//helper function: list transactions currently in memory.
function listTransactions() {

}

