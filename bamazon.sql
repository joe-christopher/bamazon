DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

use bamazon;

CREATE TABLE products(
item_id integer(10) not NULL AUTO_INCREMENT,
product_name VARCHAR(120) NOT NULL,
department_name VARCHAR(30) NOT NULL, 
price float(10) NOT NULL,
stock_quantity integer(10) NOT NULL,
PRIMARY KEY (item_id)
);


INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (1000, "Apple MacBook Pro 2017", "Computers", 2799.99, 12),
(1001, "HP ZBook 17 G2 Mobile Workstation", "Computers", 1099.99, 27),
(1002, "Samsung Galaxy S8 64GB Unlocked Phone", "Cell Phones", 599.99, 732),
(1003, "Apple iPhone X AT&T 256GB", "Cell Phones", 1291.30, 123),
(1004, "God of War - Playstation 4", "Video Games", 59.99, 102),
(1005, "Call of Duty: WWII - PlayStation 4 Standard Edition", "Video Games", 49.99, 235),
(1006, "Star Wars Battlefront II - PlayStation 4", "Video Games", 59.99, 93),
(1007, "Yamaha TRBX174 BL 4-String Electric Bass Guitar", "Musical Instruments", 199.99, 2),
(1008, "Epiphone Les Paul SPECIAL-II Electric Guitar", "Musical Instruments", 166.54, 54),
(1009, "Bose SoundSport Free Truly Wireless Sport Headphones - Black", "Head Phones", 199.00, 84),
(1010, "Hiearcool L2 Bluetooth Headphones", "Head Phones", 89.99, 34),
(1011, "Sony MDRZX110NC Noise Cancelling Headphones", "Head Phones", 29.99, 3);