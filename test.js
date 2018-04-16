//REQUIREMENTS
//----------------------------------------------------------------------
// Running this application will:


// List a set of menu options:
//  View Products for Sale
//  View Low Inventory
//  Add to Inventory
//  Add New Product
//  If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
//  If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
//  If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
//  If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

//PSEUDO CODE
//--------------------------------------------------------------------------

//  function to query database 
//      builds table for viewProducts() to use
//      builds lowInventory table for viewLowInventory() to use
//      calls managerMenu function

//  managerMenu function
//      execute switch case function to display manager menu, record input 
//      and call the following functions based on input:
//          viewProducts
//          viewLowInventory
//          addToInventory
//          addNewProduct
//  viewProducts function
//      displays product table (item IDS, names, prices and quantaties)
//  viewLowInventory function
//      displays subset of producty table for rows with quantity<5
//  addToInventory function
//      asks manager which product to add inventory to
//      updates table quantity column for selected products
//  addNewProduct
//      asks manager for all table column values for a new product
//      adds new product to table


//MAIN PROCESS
//--------------------------------------------------------------------------
//dependencies for npm packages

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var colors = require('cli-table/lib/index');

// retrieve data from sql server

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    //Testing
    // console.log("connected as id " + connection.threadId);
    
    queryProducts();
});

//Functions 
//-------------------------------------------------------------------

function managerMenu(res) {
//      execute switch statement on start to display manager menu, record input 
//      and call the following functions based on input:
//          viewProducts
//          viewLowInventory
//          addToInventory
//          addNewProduct
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
                    console.log("queryProducts() called");
                    queryProducts();
                    break;

                case "View Low Inventory":
                    console.log("queryLowProducts() called");
                    queryLowProducts();
                    break;

                case "Add to Inventory":
                    // console.log("calling addToInventory");
                    addToInventory(res);
                    break;

                case "Add New Product":
                    // console.log("calling addNewProduct");
                    addNewProduct();
                    break;

                case "Exit":
                    console.log("\nEnding program.");
                    connection.end();
                    break;
            }
        });

}


function queryProducts() {
//  function to query database 
//      builds table for viewProducts() to use
//      builds lowInventory table for viewLowInventory() to use
//      calls managerMenu function

    //queries entire product table for later use
    connection.query("SELECT * FROM products", function (err, res) {
        //formats table using cli-table npm package
        var table = new Table({
            head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'],
            colWidths: [10, 35, 35, 10, 18]
        });

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log("\nINVENTORY");
        console.log(table.toString());
        managerMenu(res);
    });
}

function queryLowProducts() {
    //queries product table with stock_quantity below 5 for later use
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        //formats table using cli-table npm package
        var lowTable = new Table({
            head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'],
            colWidths: [10, 35, 35, 10, 18]
        });

        for (var i = 0; i < res.length; i++) {
            lowTable.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log("\nLOW INVENTORY");
        console.log(lowTable.toString());

    });

};


function addToInventory(res) {
//      asks manager which product to add inventory to
//      updates table quantity column for selected products
    inquirer.prompt
        ([
            {
                type: "input",
                name: "item_id",
                message: "\nADD INVENTORY:  Please select item_id to add inventory to.",
            },
            {
                type: "input",
                name: "addQuantity",
                message: "\nADD INVENTORY:  Please enter number to increase stock_quantity by.",
            }

            // .then function to record answers
        ]).then(function (answers) {
            var item_id = parseInt(answers.item_id);
            var increaseAmount = parseInt(answers.addQuantity);
            var inStockQuantity = res[item_id - 1].stock_quantity;
            var newStockQuantity = inStockQuantity + increaseAmount;
            //Testing
            // console.log("Item selected to increase is:  " + item_id);
            // console.log("Amount to add to inventory requested is:  " + increaseAmount);
            // console.log("inStockQuantity is " + inStockQuantity);
            // console.log("newStockQuantity is " + newStockQuantity);

            connection.query('UPDATE products SET ? WHERE item_id = ?', [{ stock_quantity: newStockQuantity }, item_id]);

            //Testing
            // console.log("connection.query ran");

            console.log("\nStock Quantity for item id " + item_id + " has been increased to " + newStockQuantity);

        });
};



function addNewProduct() {
//      asks manager for all table column values for a new product
//      adds new product to table

    inquirer.prompt
        ([
            {
                type: "input",
                name: "product_name",
                message: "\nADD NEW PRODUCT:  Please enter new product name.",
            },
            {
                type: "input",
                name: "department_name",
                message: "\nWhat department sells the new product?",
            },
            {
                type: "input",
                name: "price",
                message: "\nWhat is the price of the new product?",
            },
            {
                type: "input",
                name: "stock_quantity",
                message: "\nHow much stock quantity for the new product?",
            }

            // .then function to record answers
        ]).then(function (answers) {
            var productName = answers.product_name;
            var departmentName = answers.department_name;
            var price = parseFloat(answers.price);
            var stockQuantity = parseInt(answers.stock_quantity);
            //Testing
            // console.log("Name of the new product is:  " + productName);
            // console.log("Department to add the product to is:  " + departmentName);
            // console.log("Price of the product is: " + price);
            // console.log("Stock to add is:  " + stockQuantity);

            connection.query('INSERT INTO products SET ?',
                {
                    product_name: productName,
                    department_name: departmentName,
                    price: price,
                    stock_quantity: stockQuantity
                }

            );

            //Testing
            // console.log("connection.query ran");

            console.log("\nA new product named " + productName + " has been added with the following:  ");
            console.log("\rDepartment:  " + departmentName);
            console.log("\rPrice:  " + price);
            console.log("\rQuantity in Stock:  " + stockQuantity);
            managerMenu();
        });
};