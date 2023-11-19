const mysql = require('mysql');

const db = mysql.createConnection({

});

db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
    } else {
      console.log('Connected to MySQL');
    }
});  

module.exports = db;