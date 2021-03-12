//library declarations
const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/database.js');
const { RSA_NO_PADDING } = require('constants');
const { restart } = require('nodemon');

const app = express();
app.use( bodyParser.json() );

const port = 3000;
const enableTestAPIs = true;


// Add transaction to table
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

// Spend specified number of points
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

// Get balance by payer
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
