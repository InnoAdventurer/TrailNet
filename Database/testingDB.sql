-- Database\testingDB.sql

DROP DATABASE testingDB;

CREATE DATABASE testingDB;

USE testingDB;

CREATE TABLE customer (
  id INT PRIMARY KEY,
  custname VARCHAR(100)
);

INSERT INTO customer (id, custname) VALUES
(1, 'ABC Co'),
(2, 'XYZ Corp'),
(3, 'BN Plumbing');

USE testingDB;

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(255) NOT NULL,
  event_date DATE,
  customer_id INT,
  FOREIGN KEY (customer_id) REFERENCES customer(id)
);

INSERT INTO events (event_name, event_date, customer_id) VALUES
('Product Launch', '2024-09-15', 1),
('Annual Conference', '2024-10-05', 2),
('Maintenance Seminar', '2024-11-20', 3);
