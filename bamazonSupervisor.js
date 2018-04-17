var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var colorTable = require('cli-table/lib/index');
var colors = require('colors');

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
            name: "supervisorSelect",
            message: "\nDEPARTMENT INFO:  Please select one.".blue,
            choices: ["View Product Sales by Department", "Create New Department", "Exit"]
        }

        // .then function to record answers
    ]).then(function (answers) {


        switch (answers.supervisorSelect) {
            case "View Product Sales by Department":
                displayDepartments();
                break;

            case "Create New Department":;
                addNewDepartment();
                break;

            case "Exit":
                console.log("\nEnding Application......");
                connection.end();
                break;
        }
    });
  
}

function displayDepartments()
{

    
    connection.query("SELECT d.department_id, d.department_name, d.over_head_costs, SUM(d.product_sales) as product_sales, (SUM(d.product_sales) - d.over_head_costs) as total_profit FROM (SELECT departments.department_id, departments.department_name, departments.over_head_costs, IFNULL(products.product_sales, 0) as product_sales FROM products RIGHT JOIN departments ON products.department_name = departments.department_name) as d GROUP BY department_id", function(err, res) {
        if (err) console.log(err);
        var table = new Table({
            head: ['Department ID','Department', 'Overhead', 'Sales', 'Profit/Loss'],
            colWidths: [30, 30, 15, 15, 15]
      });

      for (var i = 0; i < res.length; i++) {
          table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]);
      }
      console.log("SALES BY DEPARTMENT".blue );
      console.log(table.toString());
  
      start();4

      });
}

function addNewDepartment() {
        inquirer.prompt
            ([
                {
                    type: "input",
                    name: "department_name",
                    message: "\nADD NEW DEPARTMENT:  Please enter new department name:".blue,
                },
                {
                    type: "input",
                    name: "over_head_costs",
                    message: "\nPlease enter the overhead costs:".blue,
                }
            ]).then(function (answers) {
                var departmentName = answers.department_name;
                var overheadCosts = parseFloat(answers.over_head_costs);
 
    
                connection.query('INSERT INTO departments SET ?',
                    {
                        department_name: departmentName,
                        over_head_costs: overheadCosts
                    }
    
                );

    
                console.log("\n" + departmentName + " has been added with the following details:  ".green);
                console.log("\rOverhead Costs: ".green + overheadCosts);
              
              
                start();
            });
    };