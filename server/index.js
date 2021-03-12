//library declarations
const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/database.js');
const { RSA_NO_PADDING } = require('constants');
const { restart } = require('nodemon');
//TBD: additional library declarations as needed


const app = express();
app.use( bodyParser.json() );

const port = 3000;
const enableTestAPIs = true;

//API declarations
/*
Provide routes that:
● Add transactions for a specific payer and date. (POST)
● Spend points using the rules above and return a list of { "payer": <string>, "points": <integer> } for each call. (POST)
● Return all payer point balances. (GET)
Note:
● We are not defining specific requests/responses. Defining these is part of the exercise.
● We don’t expect you to use any durable data store. Storing transactions in memory is acceptable for the exercise.

*/

// /transaction
//TBD
app.post('/transaction', function(req, res) {
  console.log('POST /transaction received');
  console.log(req.body);
  let transaction = null;
  if(req.body[0] !== undefined) {
    transaction = req.body[0];
  } else {
    transaction = req.body;
  }

  db.addTransaction(transaction, (output) => {
    if(output === null) {
      res.status(500).end();
    } else {
      res.send(output);
    }
  })
});

// /spend
//TBD: send points by payer back to requestor on success
app.post('/spend', function(req,res) {
  console.log('POST /spend received');
  console.log(req.body);
  let points = null;
  if(req.body[0] !== undefined) {
    points = req.body[0].points;
  } else {
    points = req.body.points;
  }
  console.log(points);

  db.spendPoints(points, (output) => {
    if(output === null) {
      res.status(500).end();
    } else {
      res.send(output);
    }
  });

});

// /balance
//TBD
app.get('/balance', function(req,res) {

  console.log('GET balance received');

  db.getBalance((transactions) => {
    if(transactions === null) {
      res.status(500).end();
    } else {
      res.send(transactions);
    }
  });
});

//helper API: get all transactions currently in table
app.get('/list', function(req, res)  {
  if(enableTestAPIs === false) {
    res.status(500).end();
    return 1;
  }

  db.listTransactions((transactions) => {
    if(transactions === null) {
      res.status(500).end();
    } else {
      res.send(transactions);
    }
  });
});

//start listener on localhost:3000
app.listen(port, function() {
  console.log(`Listening on port ${port}!`);
});
