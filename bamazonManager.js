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
    createIndex();
    managerMenu();
});

function managerMenu() {
    createIndex();
    inquirer.prompt({
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }).then(function (res) {
        switch (res.choice) {
            case "View Products for Sale":
                console.log("Bringing up product list...\n");
                printProducts(false);
                break;
            case "View Low Inventory":
                console.log("Bringing up low inventory products...\n");
                printProducts(true);
                break;
            case "Add to Inventory":
                console.log("Bringing up add inventory menu...\n");
                addMenu();
                break;
            case "Add New Product":
                console.log("Bringing up add product menu...\n");
                addProduct();
                break;
            case "Exit":
                console.log("Good-bye!");
                connection.end();
        }
    });
}

// Creates initial item index
function createIndex() {
    item_index = [];
    connection.query('SELECT * from products', function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            item_index.push(res[i].item_id);
        }
    });
}

// Print products based on parameters
function printProducts(low) {
    connection.query("SELECT * from products", function (err, res) {
        if (err) throw err;
        var check = 999999;
        if (low == true) {
            check = 10;
        }
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < check) {
                console.log(
                    "Item ID: " + res[i].item_id +
                    " || Product: " + res[i].product_name +
                    " || Department: " + res[i].department_name +
                    " || Price: " + res[i].price +
                    " || # Available: " + res[i].stock_quantity
                );
                item_index.push(res[i].item_id);
            }
        }
        console.log('\n');
        managerMenu();
    });
}

// Menu for adding
function addMenu() {
    inquirer.prompt([{
        type: "input",
        name: "id",
        message: "Type the product ID you wish to add to.",
        validate: function validateID(name) {
            return (name < item_index.length && name !== '');
        }
    }, {
        type: "input",
        name: "amount",
        message: "How much would you like to add?"
    }]).then(function (res) {
        addToInv(res.id, res.amount);
    })
}

// Adds to database based on amount
function addToInv(id, amount) {
    var remainder;
    connection.query('SELECT * from products WHERE item_id=?', id, function (err, res) {
        if (err) throw err;
        remainder = parseInt(res[0].stock_quantity) + parseInt(amount);
        console.log(amount + " added to " + res[0].product_name + ". Total is " + remainder + '. \n');
        connection.query('UPDATE products SET products.stock_quantity=' + remainder + ' WHERE products.item_id=' + id, function (err, res) {
            if (err) throw err;
        });
        managerMenu();
    })
}

// Add a product
function addProduct() {
    inquirer.prompt([{
        type: "input",
        name: "product",
        message: "What is the name of product you wish to add?",
        validate: function validateProduct(name) {
            return name !== '';
        }
    }, {
        type: 'input',
        name: 'department',
        message: 'What department would you like the add your product to?',
        validate: function validateDepartment(name) {
            return name !== '';
        }
    }, {
        type: "input",
        name: "amount",
        message: "How much are in stock?"
    }, {
        type: "input",
        name: "price",
        message: "What is the cost of each unit?",
        validate: function validatePrice(name) {
            return name > 0;
        }
    }]).then(function (res) {
        insertProduct(res.product, res.department, res.amount, res.price);
    })
}

// Insert Product
function insertProduct(name, department, amount, price) {
    var values = {product_name: name, department_name: department, price: price, stock_quantity: amount}
    connection.query("INSERT INTO products SET ?",values, function (err, res) {
        if (err) throw err;
        console.log("Added to Bamazon: ");
        console.log(
            " Product: " + name +
            " || Department: " + department +
            " || Price: " + price +
            " || # Available: " + amount
        );
        managerMenu();
    });
}