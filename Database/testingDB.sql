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
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    category ENUM('Hiking', 'Cycling') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO events (name, latitude, longitude) VALUES
('Event 1', -34.4278, 150.8931),
('Event 2', -34.4271, 150.8905);
