var mysql = require("mysql");
var inquirer = require('inquirer');
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
    customerChoice();
})

// Customer Requests
function customerOrder() {
    inquirer.prompt([{
        type: "input",
        name: "id",
        message: "Type the product ID you wish to purchase."
    }, {
        type: "input",
        name: "amount",
        message: "How many would you like to purchase?"
    }]).then(function (res) {
        purchase(res.id, res.amount);
    })
}

// CHOICE, buy/sell/exit
function customerChoice() {
    inquirer.prompt([{
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: ["Buy", "Sell", "Exit"]
    }]).then(function (res) {
        switch (res.choice) {
            case "Buy":
                printAndStart();
                break;
            case "Sell":
                console.log("Not available.");
                customerChoice();
                break;
            case "Exit":
                console.log("Thank you, come again!");
                connection.end();
                break;
        }
    })
}

// Prints all products
function printAndStart() {
    item_index = [];
    connection.query('SELECT * from products', function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Item ID: " + res[i].item_id +
                " || Product: " + res[i].product_name +
                " || Department: " + res[i].department_name +
                " || Price: " + res[i].price +
                " || # Available: " + res[i].stock_quantity + "\n"
            );
            item_index.push(res[i].item_id);
        }
        customerOrder();
    });
}

// Purchase
function purchase(id, amount) {
    var remainder;
    connection.query('SELECT * from products WHERE item_id=?', id, function (err, res) {
        if (err) throw err;
        remainder = (parseInt(res[0].stock_quantity) - parseInt(amount));
        if (remainder >= 0) {
            updateAmount(id, remainder);
            console.log(amount + "x " + res[id - 1].product_name + " ordered. " + remainder + " left.")
        } else {
            console.log("Not enough " + res[id - 1].product_name + "s in stock to complete order");
            updateAmount(id,res[0].stock_quantity);
        }
    })
}

// Update Product amount
function updateAmount(id, amount) {
    connection.query('UPDATE products SET products.stock_quantity=' + amount + ' WHERE products.item_id=' + id, function (err, res) {
        if (err) throw err;
        customerChoice();
    });
}