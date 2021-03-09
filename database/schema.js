/*Schema for transaction table.

spentPoints tracks how many points tied to a non-negative transaction have been spent.  This value should always be 0 <= spentPoints <= points.
spentPoints is ignored for transactions with negative points.
*/

const schema = `CREATE TABLE transactions (
  tranID    integer     PRIMARY KEY,
  payer     text        NOT NULL,
  timestamp text        NOT NULL,
  points    integer     NOT NULL,
  spentPoints integer   DEFAULT 0
)`;

module.exports.schema = schema;