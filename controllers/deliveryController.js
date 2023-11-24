const db = require('../middleware/dbConnection.js');

exports.getOrderDeliveriesByLocation = (req, res) => {
    const locationID = req.params.locationID;
    const query = `
      SELECT 
        deliveryID, 
        deliveryType, 
        orderID,
        dateAndTime, 
        discrepancies 
      FROM Deliveries
      WHERE locationID = ${locationID}
      AND
      orderID IS NOT NULL
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

exports.getOrderDeliveriesByLocationForReporting = (req, res) => {
  const locationID = req.params.locationID;
  const query = `
    SELECT 
      deliveryID, 
      orderID,
      dateAndTime
    FROM Deliveries
    WHERE locationID = ${locationID}
    AND
    orderID IS NOT NULL
    AND
    discrepancies = 1
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

exports.getInventoryTransactionDeliveriesByLocation = (req, res) => {
  const locationID = req.params.locationID;
  const query = `
    SELECT 
      deliveryID, 
      deliveryType, 
      inventoryTransactionID,
      dateAndTime, 
      discrepancies 
    FROM Deliveries
    WHERE locationID = ${locationID}
    AND
    inventoryTransactionID IS NOT NULL
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

exports.getInventoryTransactionDeliveriesByLocationForReporting = (req, res) => {
  const locationID = req.params.locationID;
  const query = `
    SELECT 
      deliveryID, 
      inventoryTransactionID,
      dateAndTime
    FROM Deliveries
    WHERE locationID = ${locationID}
    AND
    inventoryTransactionID IS NOT NULL
    AND
    discrepancies = 1
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

exports.getOrderDeliveriesByLocationByDateRange = (req, res) => {
  const locationID = req.params.locationID;
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;
  const query = `
    SELECT 
      deliveryID, 
      deliveryType, 
      orderID,
      dateAndTime, 
      discrepancies 
    FROM Deliveries
    WHERE locationID = ${locationID}
    AND
    dateAndTime BETWEEN
    '${startDate}' 
    AND 
    '${endDate}'
    AND
    orderID IS NOT NULL
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

exports.getOrderDeliveriesByLocationByDateRangeForReporting = (req, res) => {
  const locationID = req.params.locationID;
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;
  const query = `
    SELECT 
      deliveryID, 
      orderID,
      dateAndTime
    FROM Deliveries
    WHERE locationID = ${locationID}
    AND
    dateAndTime BETWEEN
    '${startDate}' 
    AND 
    '${endDate}'
    AND
    orderID IS NOT NULL
    AND
    discrepancies = 1
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

exports.getInventoryTransactionDeliveriesByLocationByDateRange = (req, res) => {
  const locationID = req.params.locationID;
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;
  const query = `
    SELECT 
      deliveryID, 
      deliveryType, 
      inventoryTransactionID,
      dateAndTime, 
      discrepancies 
    FROM Deliveries
    WHERE locationID = ${locationID}
    AND
    dateAndTime BETWEEN
    '${startDate}' 
    AND 
    '${endDate}'
    AND
    inventoryTransactionID IS NOT NULL
    AND
    discrepancies = 1
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

exports.getInventoryTransactionDeliveriesByLocationByDateRangeForReporting = (req, res) => {
  const locationID = req.params.locationID;
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;
  const query = `
    SELECT 
      deliveryID, 
      inventoryTransactionID,
      dateAndTime
    FROM Deliveries
    WHERE locationID = ${locationID}
    AND
    dateAndTime BETWEEN
    '${startDate}' 
    AND 
    '${endDate}'
    AND
    orderID IS NOT NULL
    AND
    discrepancies = 1
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

exports.getDeliveryLineItemsByDelivery = (req, res) => {
    const deliveryID = req.params.deliveryID;
    const query = `
      SELECT deliveryID, DeliveryLineItems.ingredientID, Ingredients.ingredientName, expectedQuantity, deliveredQuantity 
      FROM DeliveryLineItems 
      INNER JOIN Ingredients 
      ON DeliveryLineItems.ingredientID = 
      Ingredients.ingredientID 
      WHERE DeliveryID = ${deliveryID};
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

exports.getLatestDeliveryByLocation = (req, res) => {
    const locationID = req.params.locationID;
    const query = `
      SELECT * 
      FROM Deliveries
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

exports.postOrderDelivery = (req, res) => {
    const { deliveryID, deliveryType, orderID, locationID, dateAndTime, discrepancies } = req.body;
    const query = `
      INSERT INTO Deliveries
        (deliveryID, deliveryType, orderID, locationID, dateAndTime, discrepancies)
      VALUES
        (${deliveryID}, ${deliveryType}, ${orderID}, ${locationID}, '${dateAndTime}', ${discrepancies})
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

exports.postInventoryTransactionDelivery = (req, res) => {
    const { deliveryID, deliveryType, inventoryTransactionID, locationID, dateAndTime, discrepancies } = req.body;
    const query = `
      INSERT INTO Deliveries
        (deliveryID, deliveryType, inventoryTransactionID, locationID, dateAndTime, discrepancies)
      VALUES
        (${deliveryID}, ${deliveryType}, ${inventoryTransactionID}, ${locationID}, '${dateAndTime}', ${discrepancies})
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
  
  exports.postDeliveryLineItems = (req, res) => {
    const { deliveryID, ingredientID, expectedQuantity, deliveredQuantity } = req.body;
    const query = `
      INSERT INTO DeliveryLineItems
        (deliveryID, ingredientID,expectedQuantity, deliveredQuantity)
      VALUES
        (${deliveryID}, ${ingredientID}, ${expectedQuantity}, ${deliveredQuantity})
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