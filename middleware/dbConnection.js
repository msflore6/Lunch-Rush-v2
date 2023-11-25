const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'lunchrush-db.cwir7lhdtksn.us-west-1.rds.amazonaws.com',
  port: 3306,
  user: 'admin',
  password: 'ASUIFT402LunchRushbmrs23',
  database: 'lunchrush'
});

db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
    } else {
      console.log('Connected to MySQL');
    }
});  

module.exports = db;