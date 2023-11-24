const db = require('../middleware/dbConnection.js');

exports.getOrdersByLocation = (req, res) => {
    const locationID = req.params.locationID;
    const query = `
      SELECT orderID, username, dateAndTime 
      FROM Orders 
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

exports.getOrdersByLocationByDateRange = (req, res) => {
  const locationID = req.params.locationID;
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;
  const query = `
    SELECT orderID, username, dateAndTime 
    FROM Orders 
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

exports.getOrderLineItemsByOrder = (req, res) => {
    const orderID = req.params.orderID;
    const query = `
      SELECT OrderLineItems.ingredientID, Ingredients.ingredientName, quantity 
      FROM OrderLineItems 
      INNER JOIN Ingredients 
      ON OrderLineItems.ingredientID = 
      Ingredients.ingredientID 
      WHERE orderID = ${orderID};
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

exports.getLatestOrderByLocation = (req, res) => {
  const locationID = req.params.locationID;
  const query = `
    SELECT * 
    FROM Orders
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

exports.postOrder = (req, res) => {
  const { orderID, username, locationID, dateAndTime } = req.body;
  const query = `
    INSERT INTO Orders
      (orderID, username, locationID, dateAndTime)
    VALUES
      (${orderID}, '${username}', ${locationID}, '${dateAndTime}')
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

exports.postOrderLineItems = (req, res) => {
  const { orderID, ingredientID, quantity } = req.body;
  const query = `
    INSERT INTO OrderLineItems
      (orderID, ingredientID, quantity)
    VALUES
      (${orderID}, ${ingredientID}, ${quantity})
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