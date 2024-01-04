// Import and require inquirer package for handling user inputs
const inquirer = require('inquirer');
// Import and require mysql2 for MySQL database interactions
const mysql = require('mysql2/promise');

// Connect to database
async function dbConnection(select) {
  try {
        // Create a connection to the MySQL database using the provided credentials
    const db = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: 'root',
      password: 'rootroot',
      database: 'employee_tracker_db',
    });

// Initialize variables for storing query results and user inputs
let returnedDbRows = [];
let returnedInquirerOutput = [];

//switch statement handling actions to be executed based off user's selections
switch (select) {
  case "View All Departments":
    // Retrieve and display all departments from the database
    returnedDbRows = await db.query(`Select * FROM department`);
    console.table(returnedDbRows[0]);
    break;

    case 'View All Roles':
// Retrieve and display all roles with their associated departments from the database      
      returnedDbRows = await db.query(`SELECT role.id, role.job_title, role.salary, department.department_name AS department 
      FROM role 
      JOIN department ON role.department_id = department.id`);
      console.table(returnedDbRows[0]);
      break;

      case 'View All Employees':
// Retrieve and display all employees with their roles, departments, and managers from the database
        returnedDbRows = await db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.job_title AS title, department.department_name AS department, role.salary AS salary, 
        CASE WHEN employee.manager_id IS NOT NULL 
        THEN CONCAT(manager_table.first_name,' ', manager_table.last_name) 
        ELSE NULL END AS manager 
        FROM employee 
        JOIN role 
        ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        JOIN employee manager_table ON employee.manager_id = manager_table.id`);
        console.table(returnedDbRows[0]);
        break;

        case 'Add a Department':
          // Add a Department case
          returnedInquirerOutput = await inquirer.prompt([
            {
              name: 'department',
              message: 'Please enter a new department name: '
            },
          ]);
        
          try {
            // Check if the department exists
            const [existingDepartment] = await db.query(
              `SELECT id FROM department WHERE department_name = '${returnedInquirerOutput.department}'`
            );
        
            if (existingDepartment.length === 0) {
              // Department does not exist, proceed with insertion
              returnedDbRows = await db.query(
                `INSERT INTO department (department_name) VALUES ('${returnedInquirerOutput.department}')`
              );
              console.log('Department added successfully!');
            } else {
              console.log('Department already exists');
              // Handle duplicate department name
            }
          } catch (error) {
            console.log('Error occurred:', error);
          }
          break;

          case 'Add a Role':
// Prompt user to enter details for the new role
  returnedInquirerOutput = await inquirer.prompt([
    {
      name: 'roleName',
      message: 'Please Enter the New Role Name: ',
    },
    {
      name: 'roleSalary',
      message: 'Please Enter Salary for the New Role: ',
    },
    {
      name: 'roleDepartment',
      message: 'Please Enter Department of New Role: ',
    },
  ]);

  const { roleName, roleSalary, roleDepartment } = returnedInquirerOutput;

  try {
    const [departmentRows] = await db.query(
      `SELECT id FROM department WHERE department_name = ?`,
      [roleDepartment]
    );

    if (departmentRows.length > 0) {
      const department_id = departmentRows[0].id;

      returnedDbRows = await db.query(
        `INSERT INTO role (job_title, salary, department_id) VALUES (?, ?, ?)`,
        [roleName, roleSalary, department_id]
      );

      console.log('Role added successfully!');
    } else {
      console.log('Department not found.'); // Handle when department does not exist
    }
  } catch (error) {
    console.log('Error occurred:', error);
  }
  break;

          
  case "Add an Employee":
  // Prompt the user to input the new employee's first name, last name, role, and manager    
  returnedInquirerOutput = await inquirer.prompt([
    {
      name: "first_name",
      message: "Please Enter New Employee's First Name:",
    },
    {
      name: "last_name",
      message: "Please Enter New Employee's Last Name:",
    },
    {
      name: "role",
      message: "Please Enter New Employee's Role:",
    },
    {
      name: "manager",
      message: "Please Enter New Employee's Manager:",
    },
  ]);

  try {
  // Retrieve all roles and managers from the database  
    const totalRoles = await db.query("SELECT * FROM role");
    const totalManagers = await db.query(
      "SELECT * FROM employee WHERE manager_id IS NULL"
    );

    // Extract input data from the user prompt
    const { first_name, last_name, role, manager } = returnedInquirerOutput;

    // Find the role and manager data based on the user input
    const roleData = totalRoles[0].find((r) => r.job_title === role);
    const managerData = totalManagers[0].find(
      (m) => `${m.first_name} ${m.last_name}` === manager
    );
    // Check if the specified role or manager does not exist in the database
    if (!roleData || !managerData) {
      console.log("Role or manager not found.");
      break;
    }
    // Insert the new employee with the provided details into the database
    returnedDbRows = await db.query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${roleData.id}, ${managerData.id})`
    );
    console.log("Employee added successfully!");
  } catch (error) {
    console.log("Error occurred:", error);
  }
  break;

  case "Update Employee Role":
  try {
  // Retrieve current employees and their roles from the database
    const [currentEmployees] = await db.query(`
      SELECT id, first_name, last_name FROM employee;
    `);

    const [currentRoles] = await db.query(`
      SELECT id, job_title FROM role;
    `);
    // Create lists of employees and roles for inquirer prompts
    const employeeList = currentEmployees.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });

    const roleList = currentRoles.map((role) => {
      return {
        name: role.job_title,
        value: role.id,
      };
    });

    // Prompt the user to select an employee and a new role for update
    returnedInquirerOutput = await inquirer.prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Please Choose Which Employee to Update:",
        choices: employeeList,
      },
      {
        type: "list",
        name: "newRoleId",
        message: "Please Select Employee's New Role:",
        choices: roleList,
      },
    ]);

    const { employeeId, newRoleId } = returnedInquirerOutput;
    // Update the employee's role in the database
    await db.query(
      `UPDATE employee SET role_id = ? WHERE id = ?`,
      [newRoleId, employeeId]
    );

    console.log("Employee role updated successfully!");
  } catch (error) {
    console.log("Error occurred:", error);
  }
  break;

  case 'View Employees by Manager':
  // Prompt the user to enter the manager's name
  returnedInquirerOutput = await inquirer.prompt([
    {
      name: 'managerName',
      message: "Please Enter Manager's Name:",
    },
  ]);

  try {
    // Retrieve the manager's ID based on the provided name
    const [managerIdResult] = await db.query(
      `SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?`,
      [returnedInquirerOutput.managerName]
    );

    if (managerIdResult && managerIdResult.length > 0) {
      const managerId = managerIdResult[0].id;
      // Fetch employees managed by the specified manager
      returnedDbRows = await db.query(`
        SELECT employee.id, employee.first_name, employee.last_name, role.job_title AS title, department.department_name AS department, role.salary AS salary
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        WHERE employee.manager_id = ${managerId}
      `);

      console.table(returnedDbRows[0]);
    } else {
      console.log('Manager not found.');
      // Handle when the manager is not found
    }
  } catch (error) {
    console.log('Error occurred:', error);
  }
  break;

  case 'View Employees by Department':
  try {
    // Retrieve all departments and create choices for the user
    const [departments] = await db.query(`SELECT * FROM department`);
    const departmentChoices = departments.map((dept) => ({
      name: dept.department_name,
      value: dept.id,
    }));
    // Prompt the user to choose a department
    const selectedDepartment = await inquirer.prompt([
      {
        type: 'list',
        name: 'departmentId',
        message: 'Please choose a department:',
        choices: departmentChoices,
      },
    ]);
    // Fetch employees based on the selected department
    const [employeesByDepartment] = await db.query(`
      SELECT employee.id, employee.first_name, employee.last_name, role.job_title AS title
      FROM employee
      JOIN role ON employee.role_id = role.id
      WHERE role.department_id = ?
    `, [selectedDepartment.departmentId]);

    console.table(employeesByDepartment);
  } catch (error) {
    console.log('Error occurred:', error);
  }
  break;

    }
  } catch (err) {
    console.log(err);
  }
}


// Function to prompt users with the list of actions available
async function userPrompt() {
  try {
    const res = await inquirer.prompt([
      {
        type: "list",
        name: "select",
        message: "What do you want to do?",
        choices: [
// List of available actions that users can choose from
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update Employee Role",
          "View Employees by Manager",
          "View Employees by Department",
          new inquirer.Separator(),
          "Quit",
        ],
      },
    ]);
    // Check user's choice and execute the respective action
    if (res.select === "Quit") {
      process.exit();
    } else {
      await dbConnection(res.select);
      await userPrompt();
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}
// Call the function to start the program and prompt the user
userPrompt();