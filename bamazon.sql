DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

use bamazon;

CREATE TABLE products(
item_id integer(10) not NULL AUTO_INCREMENT,
product_name VARCHAR(120) NOT NULL,
department_name VARCHAR(30) NOT NULL, 
price decimal(10,2) NOT NULL,
stock_quantity integer(10) NOT NULL,
product_sales decimal(10,2) NOT NULL ,
PRIMARY KEY (item_id)
);

CREATE TABLE departments(
department_id integer(10) not NULL AUTO_INCREMENT,
department_name VARCHAR(30) NOT NULL,
over_head_costs decimal(10,2),
PRIMARY KEY (department_id)
);

INSERT INTO departments (department_id,department_name, over_head_costs)
VALUES (321001, "Computers", 259.50),
(321002, "Cell Phones", 65.76),
(321003, "Video Games", 93.42),
(321004, "Musical Instruments", 124.50),
(321005, "Head Phones", 99.00);



INSERT INTO products (item_id, product_name, department_name, price, stock_quantity, product_sales)
VALUES (1000, "Apple MacBook Pro 2017", "Computers", 2799.99, 12,0),
(1001, "HP ZBook 17 G2 Mobile Workstation", "Computers", 1099.99, 27,0),
(1002, "Samsung Galaxy S8 64GB Unlocked Phone", "Cell Phones", 599.99, 732,0),
(1003, "Apple iPhone X AT&T 256GB", "Cell Phones", 1291.30, 123,0),
(1004, "God of War - Playstation 4", "Video Games", 59.99, 102,0),
(1005, "Call of Duty: WWII - PlayStation 4 Standard Edition", "Video Games", 49.99, 235,0),
(1006, "Star Wars Battlefront II - PlayStation 4", "Video Games", 59.99, 93,0),
(1007, "Yamaha TRBX174 BL 4-String Electric Bass Guitar", "Musical Instruments", 199.99, 2,0),
(1008, "Epiphone Les Paul SPECIAL-II Electric Guitar", "Musical Instruments", 166.54, 54,0),
(1009, "Bose SoundSport Free Truly Wireless Sport Headphones - Black", "Head Phones", 199.00, 84,0),
(1010, "Hiearcool L2 Bluetooth Headphones", "Head Phones", 89.99, 34,0),
(1011, "Sony MDRZX110NC Noise Cancelling Headphones", "Head Phones", 29.99, 3,0);