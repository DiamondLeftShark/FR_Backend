//library declarations
var express = require('express');
//TBD: additional library declarations as needed


var app = express();


//API declarations
/*
Provide routes that:
● Add transactions for a specific payer and date.
● Spend points using the rules above and return a list of { "payer": <string>, "points": <integer> } for each call.
● Return all payer point balances.
Note:
● We are not defining specific requests/responses. Defining these is part of the exercise.
● We don’t expect you to use any durable data store. Storing transactions in memory is acceptable for the exercise.

*/


//start listener on localhost:3000
app.listen(3000, function() {
  console.log('listening on port 3000!');
});
