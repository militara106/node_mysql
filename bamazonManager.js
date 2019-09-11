var inquirer = require("inquirer");
var mysql = require("mysql");
var item_index = [];

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'amilitar106',
    database: 'bamazon'
});

// MAIN LOGIC
connection.connect(function (err) {
    if (err) throw err;
    managerMenu();
});

function managerMenu() {
    inquirer.prompt({
        type: "list",
        name: "choice",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }).then(function (res) {
        switch (res.choice) {
            case "View Products for Sale":
                console.log("Bringing up product list...\n");
                break;
            case "View Low Inventory":
                console.log("Bringing up low inventory products...\n");
                break;
            case "Add to Inventory":
                console.log("Bringing up inventory add menu...\n");
                break;
            case "Add New Product":
                console.log("Bringing up product add menu...\n");
                break;
            case "Exit":
                console.log("Good-bye!");
                connection.end();
        }
    });
}

function printProducts() {
    connection.query("SELECT * from products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Item ID: " + res[i].item_id +
                " || Product: " + res[i].product_name +
                " || Department: " + res[i].department_name +
                " || Price: " + res[i].price +
                " || # Available: " + res[i].stock_quantity
            );
            item_index.push(res[i].item_id);
        }
    });
}