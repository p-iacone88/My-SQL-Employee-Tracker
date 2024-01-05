# Employee Tracker Application

This Employee Tracker application is a command-line interface tool built using Node.js, MySQL, and Inquirer to manage employees, departments, and roles within a company. The application interacts with a MySQL database to perform CRUD (Create, Read, Update, Delete) operations on employee information so that the user can view and add employees, view and add departments, add and view roles within company, as well as change employee's managers.

## Table of Contents

- [Features](#features)
- [Setup](#setup)
- [Dependencies](#dependencies)
- [Usage](#usage)
- [Video](#video)
- [Credits](#credits)

## Features

- View all departments, roles, and employees
- Add departments, roles, and employees
- Update employee roles
- View employees by manager
- View employees by department

## Setup

To run the Employee Tracker application, follow these steps:

1. Clone this repository to your local machine.
2. Ensure you have Node.js and MySQL installed on your system.
3. Install the necessary dependencies using the following command:

   ```bash
   npm install
   ```

4. Set up the MySQL database by executing the provided seeds.sql file to create and populate the necessary tables for the application.

5. Update the database connection settings in the code:

- host: Set the MySQL server hostname.
- port: Set the MySQL server port number.
- user: Provide the MySQL user.
- password: Provide the MySQL password.
- database: Specify the database name for the Employee Tracker (employee_tracker_db).

3. Once the setup is complete, run the application using the following command:

```bash
node app.js
```

4. Follow the prompts to interact with the Employee Tracker application and perform various actions.

## Dependencies

This app uses the following Node.js packages:

- 'inquirer': Handles user inputs in the command line interface.
- 'mysql2': Interacts with the MySQL database using promises.

## Usage

Upon running the application (node app.js), users are presented with a list of actions they can perform:

View All Departments
View All Roles
View All Employees
Add a Department
Add a Role
Add an Employee
Update Employee Role
View Employees by Manager
View Employees by Department
Quit

Choose an action by selecting the corresponding option, and follow the prompts to complete the operation.

## Video

https://watch.screencastify.com/v/NA8ryhw3Vm0982jCTj8l

## Credits

Project inspired by the edX Full-Stack Web Development Boot Camp.
Personal tutoring provided by Alexis San Javier and Dru Sanchez, and assistance provided by Andrew Layendecker.
