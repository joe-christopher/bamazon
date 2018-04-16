var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var colors = require('cli-table/lib/index');


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon",
  socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});

connection.connect(function(err) {
  if (err) throw err;

    start();
});

function start()
{
    inquirer.prompt
    ([
        {
            type: "list",
            name: "managerSelect",
            message: "\nMANAGE INVENTORY:  Please select one.",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }

        // .then function to record answers
    ]).then(function (answers) {


        switch (answers.managerSelect) {
            case "View Products for Sale":
                displayProducts();
                break;

            case "View Low Inventory":
                displayLowInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":;
                addNewProduct();
                break;

            case "Exit":
                console.log("\nEnding Application......");
                connection.end();
                break;
        }
    });
  
}

function displayProducts()
{
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) console.log(err);
    
        var table = new Table({
            head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'],
            colWidths: [10, 80, 35, 10, 18]
      });

      for (var i = 0; i < res.length; i++) {
          table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
      }
      console.log("PRODUCT INVENTORY" );
      console.log(table.toString());
      start();

      });
}

function displayLowInventory()
{
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) console.log(err);

        var table = new Table({
            head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'],
            colWidths: [10, 80, 35, 10, 18]
      });

      for (var i = 0; i < res.length; i++) {
          table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
      }

      console.log("LOW INVENTORY");
      console.log(table.toString());
      start();

      });
}

function addInventory(res)
{
     console.log("WELCOME TO BAMAZON ONLINE STORE")
     connection.query("SELECT * FROM products", function(err, res) {
        if (err) console.log(err);

  inquirer.prompt
        ([
            {
                name: "ID",
                message: "Please enter the Item ID for which you would like to add inventory: "
            }, {
                name: "quantity",
                message: "Please enter the quantity of inventory you would like add: "
            }

        ]).then(function (answers) {

            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id == answers.ID) {
                    var chosenItem = res[i];
                }
            }
            var item_id = answers.ID;
            var orderProduct = chosenItem.product_name;
            var addQuantity = parseInt(answers.quantity);
            var inStockQuantity = parseInt(chosenItem.stock_quantity);
            var newStockQuantity = parseInt(inStockQuantity) + parseInt(addQuantity);
            var price = chosenItem.price;
        
  

                connection.query('UPDATE products SET ? WHERE item_id = ?', [{ stock_quantity: newStockQuantity }, item_id]);

                // connection.end();
                console.log("\nThe inventory update is confirmed: \r");
                console.log("Product selected: " + orderProduct + "\r");
                console.log("Previous Quantity: " + inStockQuantity + "\r");
                console.log("Inventory Added: " + addQuantity + "\r");
                console.log("Current Quantity: " + newStockQuantity + "\r");
            
                start();
        });
    });

};


function addNewProduct() {
        inquirer.prompt
            ([
                {
                    type: "input",
                    name: "product_name",
                    message: "\nADD NEW PRODUCT:  Please enter new product name:",
                },
                {
                    type: "input",
                    name: "department_name",
                    message: "\nPlease enter the product department:",
                },
                {
                    type: "input",
                    name: "price",
                    message: "\nPlease enter the product price:",
                },
                {
                    type: "input",
                    name: "stock_quantity",
                    message: "\nPlease enter the product quantity to add:",
                }
    
                // .then function to record answers
            ]).then(function (answers) {
                var productName = answers.product_name;
                var departmentName = answers.department_name;
                var price = parseFloat(answers.price);
                var stockQuantity = parseInt(answers.stock_quantity);
 
    
                connection.query('INSERT INTO products SET ?',
                    {
                        product_name: productName,
                        department_name: departmentName,
                        price: price,
                        stock_quantity: stockQuantity
                    }
    
                );

    
                console.log("\n" + productName + " has been added with the following details:  ");
                console.log("\rDepartment:  " + departmentName);
                console.log("\rPrice:  " + price);
                console.log("\rQuantity in Stock:  " + stockQuantity);
                start();
            });
    };