const db = require('../middleware/dbConnection.js');

exports.getInventoryLogsByLocation = (req, res) => {
    const locationID = req.params.locationID;
    const query = `
      SELECT inventoryLogID, dateAndTime 
      FROM InventoryLog 
      WHERE locationID = ${locationID}
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.json(results);
    });
};

exports.getInventoryLogsByLocationAndDateRange = (req, res) => {
  const locationID = req.params.locationID;
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;
  const query = `
    SELECT inventoryLogID, dateAndTime 
    FROM InventoryLog 
    WHERE locationID = ${locationID}
    AND
    dateAndTime BETWEEN
    '${startDate} 00:00:00'
    AND 
    '${endDate} 23:59:59'
  `;
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
    const query = `
      SELECT 
        InventoryLogLineItems.ingredientID, 
        Ingredients.ingredientName, 
        InventoryLogLineItems.quantity 
      FROM InventoryLog 
      INNER JOIN InventoryLogLineItems 
      ON 
        InventoryLog.inventoryLogID = 
        InventoryLogLineItems.inventoryLogID 
      INNER JOIN Ingredients 
      ON 
        InventoryLogLineItems.ingredientID = 
        Ingredients.ingredientID 
      WHERE InventoryLog.inventoryLogID = ${inventoryLogID} 
      ORDER BY InventoryLogLineItems.ingredientID
    `;
    db.query(query, (err, results) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        res.json(results);
    });
};

exports.getLatestInventoryLogByLocation = (req, res) => {
  const locationID = req.params.locationID;
  const query = `
    SELECT * 
    FROM InventoryLog 
    WHERE locationID = ${locationID} 
    ORDER BY dateAndTime DESC 
    LIMIT 1
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
};

exports.postInventoryLog = (req, res) => {
  const { inventoryLogID, locationID, dateAndTime } = req.body;
  const query = `
    INSERT INTO InventoryLog
      (inventoryLogID, locationID, dateAndTime)
    VALUES
      (${inventoryLogID}, ${locationID}, '${dateAndTime}')
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
};

exports.postInventoryLogLineItems = (req, res) => {
  const { inventoryLogID, ingredientID, quantity } = req.body;
  const query = `
    INSERT INTO InventoryLogLineItems
      (inventoryLogID, ingredientID, quantity)
    VALUES
      (${inventoryLogID}, ${ingredientID}, ${quantity})
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
};