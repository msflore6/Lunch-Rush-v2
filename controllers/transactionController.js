const db = require('../middleware/dbConnection.js');

exports.getTransactionsByLocation = (req, res) => {
    const locationID = req.params.locationID;
    const query = `
      SELECT transactionID, dateAndTime, balance, employeeID 
      FROM Transactions 
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

exports.getTransactionsByLocationByDateRange = (req, res) => {
  const locationID = req.params.locationID;
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;
  const query = `
    SELECT transactionID, dateAndTime, balance, employeeID 
    FROM Transactions 
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

exports.getTransactionLineItemsByTransaction = (req, res) => {
    const transactionID = req.params.transactionID;
    const query = `SELECT transactionID, MenuItems.menuItemID, MenuItems.itemName, quantity 
    FROM TransactionLineItems 
    INNER JOIN MenuItems 
    ON TransactionLineItems.menuItemID = 
    MenuItems.menuItemID 
    WHERE transactionID = ${transactionID}
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