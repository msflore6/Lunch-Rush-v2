const db = require('../dbConnection.js');

exports.getAllIngredients = (req, res) => {
    const query = `SELECT * FROM Ingredients`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.json(results);
    });
};

