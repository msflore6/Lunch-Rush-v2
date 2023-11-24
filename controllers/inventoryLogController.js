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

exports.getInventoryLogLineItemsByInventoryLog = (req, res) => {
    const inventoryLogID = req.params.inventoryLogID;
    const query = `
      SELECT 
        InventoryLogLineItems.ingredientID, 
        Ingredients.ingredientName, 
        InventoryLogLineItems.quantity 
      FROM InventoryLogLineItems 
      INNER JOIN Ingredients 
      ON 
        InventoryLogLineItems.ingredientID = 
        Ingredients.ingredientID 
      WHERE InventoryLogLineItems.inventoryLogID = ${inventoryLogID} 
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

exports.getInventoryDiscrepanciesByLocation = (req, res) => {
  const locationID = req.params.locationID;
  const query = `
    SELECT inventoryLogID, dateAndTime, totalDifference, degree
    FROM InventoryDiscrepancies
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

exports.getInventoryDiscrepanciesByLocationAndDateRange = (req, res) => {
  const locationID = req.params.locationID;
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;
  const query = `
    SELECT inventoryDiscrepancyID, dateAndTime, totalDifference, degree
    FROM InventoryDiscrepancies 
    WHERE locationID = ${locationID}
    AND
    dateAndTime BETWEEN
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

exports.getInventoryDiscrepancyLineItemsByInventoryDiscrepancy = (req, res) => {
    const inventoryLogID = req.params.inventoryLogID;
    const query = `
      SELECT 
        InventoryDiscrepancyLineItems.ingredientID, 
        Ingredients.ingredientName, 
        expectedQuantity,
        actualQuantity,
        difference
      FROM InventoryDiscrepancyLineItems 
      INNER JOIN Ingredients 
      ON 
        InventoryDiscrepancyLineItems.ingredientID = 
        Ingredients.ingredientID 
      WHERE InventoryDiscrepancyLineItems.inventoryLogID = ${inventoryLogID} 
      ORDER BY InventoryDiscrepancyLineItems.ingredientID
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

exports.postInventoryDiscrepancy = (req, res) => {
  const { inventoryLogID, locationID, dateAndTime, totalDifference, degree } = req.body;
  const query = `
    INSERT INTO InventoryDiscrepancies
      (inventoryLogID, locationID, dateAndTime, totalDifference, degree)
    VALUES
      (${inventoryLogID}, ${locationID}, '${dateAndTime}', ${totalDifference}, ${degree})
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

exports.postInventoryDiscrepancyLineItems = (req, res) => {
  const { inventoryLogID, ingredientID, expectedQuantity, actualQuantity, difference } = req.body;
  const query = `
    INSERT INTO InventoryDiscrepancyLineItems
      (inventoryLogID, ingredientID, expectedQuantity, actualQuantity, difference)
    VALUES
      (${inventoryLogID}, ${ingredientID}, ${expectedQuantity}, ${actualQuantity}, ${difference})
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