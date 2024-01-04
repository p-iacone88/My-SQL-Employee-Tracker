DROP DATABASE IF EXISTS employee_tracker_db;
-- create new database
CREATE DATABASE employee_tracker_db;
-- switch to that new database
USE employee_tracker_db;
-- Department table created
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL -- department name
);
-- Role table created
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(30) NOT NULL,
    salary INT NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id) -- link to department table
    ON DELETE CASCADE -- delete roles if associated department deleted
);
-- Employee table created
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) 
    REFERENCES role(id), -- link to role table
    FOREIGN KEY (manager_id)
    REFERENCES employee(id) -- link to employee table
    ON DELETE SET NULL -- set manager_id to NULL if manager deleted
);
