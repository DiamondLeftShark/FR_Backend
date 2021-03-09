//schema for transaction table

const schema = `CREATE TABLE transactions (
  tranID    integer     PRIMARY KEY,
  payer     text        NOT NULL,
  timestamp text        NOT NULL,
  points    integer     NOT NULL,
  spentPoints integer   DEFAULT 0
)`;

module.exports.schema = schema;