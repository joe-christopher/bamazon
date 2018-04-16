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
    inquirer
    .prompt({
      name: "postOrBid",
      type: "rawlist",
      message: "Would you like to [BROWSE] our products or [QUIT] the application?",
      choices: ["BROWSE", "QUIT"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.postOrBid.toUpperCase() === "BROWSE") {
        displayProducts();
      }
      else {
        console.log("Goodbye......");
        connection.end();
      }
    });
  
}

function displayProducts()
{
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) console.log(err);
    
        var table = new Table({
          head: ['Item ID', 'Product', 'price'],
          colWidths: [10, 80, 10]
      });

      for (var i = 0; i < res.length; i++) {
          table.push([res[i].item_id, res[i].product_name, res[i].price]);
      }

      console.log(table.toString());
        buyProducts(res);

      });
}

function buyProducts(res)
{
    console.log("WELCOME TO BAMAZON ONLINE STORE")
  inquirer.prompt
        ([
            {
                name: "ID",
                message: "Please enter the Item ID you would like to purchase: "
            }, {
                name: "quantity",
                message: "Please enter the quantity you would like to purchase: "
            }

        ]).then(function (answers) {

            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id == answers.ID) {
                    var chosenItem = res[i];
                }
            }
            var item_id = answers.ID;
            var orderProduct = chosenItem.product_name;
            var orderQuantity = answers.quantity;
            var inStockQuantity = chosenItem.stock_quantity;
            var newStockQuantity = parseInt(inStockQuantity) - parseInt(orderQuantity);
            var price = chosenItem.price;
            var total = price * orderQuantity;


            //if there's enough inventory, change inventory and show customer total purchase cost
            //       
            if (orderQuantity <= inStockQuantity) {
                connection.query('UPDATE products SET ? WHERE item_id = ?', [{ stock_quantity: newStockQuantity }, item_id]);

                // connection.end();
                console.log("\nThe following purchase is confirmed: \r");
                console.log("Product selected: " + orderProduct + "\r");
                console.log("Quantity: " + orderQuantity + "\r");
                console.log("Price: " + price + "\r");
                console.log("Your total is:  " + total);

            }
            //else, notify customer of insufficient inventory
            else
                console.log("Sorry, there is insufficient stock to complete your order.");
            
                start();
        });

};