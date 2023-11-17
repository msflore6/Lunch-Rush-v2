const db = require('../dbConnection.js');

exports.getInventoryLogsByLocation = (req, res) => {
    const locationID = req.params.locationID;
    const query = `SELECT inventoryLogID, dateAndTime FROM InventoryLog WHERE locationID = ${locationID}`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.json(results);
    });
};

exports.getInventoryLogLineItemsByInventoryLog = (req, res) => {
    const inventoryLogID = req.params.inventoryLogID;
    const query = `SELECT InventoryLogLineItems.ingredientID, Ingredients.ingredientName, InventoryLogLineItems.quantity FROM InventoryLog INNER JOIN InventoryLogLineItems ON InventoryLog.inventoryLogID = InventoryLogLineItems.inventoryLogID INNER JOIN Ingredients ON InventoryLogLineItems.ingredientID = Ingredients.ingredientID WHERE InventoryLog.inventoryLogID = ${inventoryLogID} ORDER BY InventoryLogLineItems.ingredientID`;
    db.query(query, (err, results) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        res.json(results);
    });
};