DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(50) NOT NULL,
department_name VARCHAR(50) NULL,
price DECIMAL(20,2) NOT NULL,
stock_quantity INT(100) NOT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES
("Toy Car","Toys",2.50, 20),
("Teddy Bear","Toys",13.00, 10),
("Laptop","Electronics",700, 50),
("Headphones","Electronics",60, 20),
("Shampoo","Hygiene",8.25, 80),
("Conditioner","Hygiene",8.30, 70),
("Wisp","Workers",60, 100),
("Peon","Workers",75, 60),
("Peasant","Workers",75, 50),
("Acolyte","Workers",75, 60);

SELECT * FROM products;