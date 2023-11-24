const db = require('../middleware/dbConnection.js');

exports.getAllMenuItems = (req, res) => {
  const query = `SELECT * FROM MenuItems`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
};

exports.getMenuItemByID = (req, res) => {
    const menuItemID = req.params.menuItemID;
    const query = `SELECT * FROM MenuItems WHERE menuItemID = ${menuItemID}`;
    db.query(query, (err, results) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        res.json(results);
    });
};

exports.getIngredientsByMenuItem = (req, res) => {
    const menuItemID = req.params.menuItemID;
    const query = `
      SELECT 
        MenuItemIngredients.ingredientID, 
        Ingredients.ingredientName, 
        Ingredients.measurementUnit, 
        MenuItemIngredients.quantity, 
        Ingredients.costPerUnit 
      FROM 
        MenuItemIngredients 
      INNER JOIN 
        Ingredients 
      ON 
        MenuItemIngredients.ingredientID 
        = 
        Ingredients.ingredientID 
      WHERE 
        menuItemID 
        = 
        ${menuItemID}
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