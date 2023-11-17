const db = require('../middleware/dbConnection.js');

exports.getInventoryTransactionsByLocation = (req, res) => {
    const locationID = req.params.locationID;
    const query = `SELECT * FROM InventoryTransactions WHERE outgoingLocationID = ${locationID} OR incomingLocationID = ${locationID}`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.json(results);
    });
};

exports.getInventoryTransactionLineItemsByInventoryLog = (req, res) => {
    const inventoryTransactionID = req.params.inventoryTransactionID;
    const query = `SELECT Ingredients.ingredientID, Ingredients.ingredientName, quantity FROM InventoryTransactionLineItems INNER JOIN Ingredients ON InventoryTransactionLineItems.ingredientID = Ingredients.ingredientID WHERE inventoryTransactionID = ${inventoryTransactionID}`;
    db.query(query, (err, results) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        res.json(results);
    });
};