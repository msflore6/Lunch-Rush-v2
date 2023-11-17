const db = require('../dbConnection.js');

exports.getOrdersByLocation = (req, res) => {
    const locationID = req.params.locationID;
    const query = `SELECT orderID, username, dateAndTime FROM Orders WHERE locationID = ${locationID}`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.json(results);
    });
};

exports.getOrderLineItemsByOrder = (req, res) => {
    const orderID = req.params.orderID;
    const query = `SELECT OrderLineItems.ingredientID, Ingredients.ingredientName, quantity FROM OrderLineItems INNER JOIN Ingredients ON OrderLineItems.ingredientID = Ingredients.ingredientID WHERE orderID = ${orderID};`;
    db.query(query, (err, results) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        res.json(results);
    });
};