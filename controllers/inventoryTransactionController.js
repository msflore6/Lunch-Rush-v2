const db = require('../middleware/dbConnection.js');

exports.getInventoryTransactionsByLocation = (req, res) => {
    const locationID = req.params.locationID;
    const query = `
      SELECT * FROM InventoryTransactions 
      WHERE outgoingLocationID = ${locationID} 
      OR incomingLocationID = ${locationID}
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

exports.getInventoryTransactionsByIncomingLocation = (req, res) => {
  const locationID = req.params.locationID;
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;
  const query = `
    SELECT * FROM InventoryTransactions 
    WHERE incomingLocationID = ${locationID}
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

exports.getInventoryTransactionsByOutgoingLocationByDate = (req, res) => {
  const locationID = req.params.locationID;
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;
  const query = `
    SELECT * FROM InventoryTransactions 
    WHERE outgoingLocationID = ${locationID}
    AND
    transactionDate BETWEEN
    '${startDate}'
    AND 
    '${endDate}'
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

exports.getInventoryTransactionsByLocationByDateRange = (req, res) => {
  const locationID = req.params.locationID;
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;
  const query = `
    SELECT * FROM InventoryTransactions 
    WHERE
    (outgoingLocationID = ${locationID} OR incomingLocationID = ${locationID})
    AND
    transactionDate BETWEEN
    '${startDate}'
    AND 
    '${endDate}'
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

exports.getInventoryTransactionLineItemsByInventoryTransaction = (req, res) => {
    const inventoryTransactionID = req.params.inventoryTransactionID;
    const query = `
      SELECT Ingredients.ingredientID, Ingredients.ingredientName, quantity 
      FROM InventoryTransactionLineItems 
      INNER JOIN Ingredients 
      ON InventoryTransactionLineItems.ingredientID = Ingredients.ingredientID 
      WHERE inventoryTransactionID = ${inventoryTransactionID}
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

exports.getInventoryTransactionLineItemsByInventoryTransactionWithID = (req, res) => {
  const inventoryTransactionID = req.params.inventoryTransactionID;
  const query = `
    SELECT InventoryTransactionID, Ingredients.ingredientID, Ingredients.ingredientName, quantity 
    FROM InventoryTransactionLineItems 
    INNER JOIN Ingredients 
    ON InventoryTransactionLineItems.ingredientID = Ingredients.ingredientID 
    WHERE inventoryTransactionID = ${inventoryTransactionID}
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

exports.getLatestInventoryTransactionByLocation = (req, res) => {
  const locationID = req.params.locationID;
  const query = `
    SELECT *
    FROM InventoryTransactions 
    WHERE outgoingLocationID = ${locationID} 
    ORDER BY transactionDate DESC, 
    inventoryTransactionID DESC 
    LIMIT 1;
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

exports.postInventoryTransaction = (req, res) => {
  const { inventoryTransactionID, outgoingLocationID, incomingLocationID, date } = req.body;
  const query = `
    INSERT INTO InventoryTransactions
      (inventoryTransactionID, outgoingLocationID, incomingLocationID, transactionDate)
    VALUES
      (${inventoryTransactionID}, ${outgoingLocationID}, ${incomingLocationID}, '${date}')
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

exports.postInventoryTransactionLineItems = (req, res) => {
  const { inventoryTransactionID, ingredientID, quantity } = req.body;
  const query = `
    INSERT INTO InventoryTransactionLineItems
      (inventoryTransactionID, ingredientID, quantity)
    VALUES
      (${inventoryTransactionID}, ${ingredientID}, ${quantity})
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