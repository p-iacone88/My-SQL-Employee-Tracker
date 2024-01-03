// Import and require inquirer
const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');

// Connect to database

const db = mysql.createConnection(
  {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rootroot',
    database: 'employee_tracker_db'
  }
);

let returnedDbRows = [];
let returnedInquirerOutput = [];

switch (select) {
  case "View All Departments":
    returnedDbRows = db.query(`Select * FROM department`);
    console.table(returnedDbRows[0]);
    break;

    case 'View All Roles':
      returnedDbRows = db.query(`SELECT role.id, role.job_title, role.salary, department.department_name AS department 
      FROM role 
      JOIN department ON role.department_id = department.id`);
      console.table(returnedDbRows[0]);
      break;

      case 'View All Employees':
        returnedDbRows = db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.job_title AS title, department.department_name AS department, role.salary AS salary, 
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
          returnedInquirerOutput = inquirer.prompt([
            {
            name: 'department',
            message: 'Please enter a new department name: '
            },
          ]);

          try {
            // Check if the department exists
            const existingDepartment = await db.query(
              `SELECT id FROM department WHERE name = '${returnedInquirerOutput.department}'`
            );
          
            if (existingDepartment.length === 0) {
              // Department does not exist, proceed with insertion
              returnedDbRows = await db.query(
                `INSERT INTO department (name) VALUES ('${returnedInquirerOutput.department}')`
              );
            } else {
              console.log('Department already exists');
              // Handle duplicate department name
            }
          } catch (error) {
            console.log('Error occurred:', error);
          }
          break;

          case 'Add a Role':
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
                message: 'Please Enter Department of New Role : ',
              },
            ]);

            const { roleName, roleSalary, roleDepartment } = returnedInquirerOutput;

            const returnDepartmentId = db.query(`
            SELECT IF NULL((SELECT id FROM department WHERE name = '${roleDepartment}'), 'Department doesn't exist')
            `);

            const [rows] = returnDepartmentId;
            const department_id = Object.values(rows[0]) [0];

            if (department_id === 'Department Does Not Exist') {
              console.log('Please Enter a Role in an Existing Department.');
              break;
            }

            returnedDbRows = db.query(
              `INSERT INTO role (job_title, salary, department_id)
              VALUES ('${roleName}' '${roleSalary}', '${department_id}');`
            );
            break;
}

