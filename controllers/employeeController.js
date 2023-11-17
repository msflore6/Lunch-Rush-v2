const db = require('../middleware/dbConnection.js');

exports.getEmployeesByLocation = (req, res) => {
    const locationID = req.params.locationID;
    const query = `SELECT employeeID, firstName, lastName, jobRole FROM Employees WHERE locationID = ${locationID} ORDER BY jobRole`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.json(results);
    });
};