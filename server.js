// Import and require inquirer
const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');

// Connect to database

async function dbConnection(select) {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: 'root',
      password: 'rootroot',
      database: 'employee_tracker_db',
    });

let returnedDbRows = [];
let returnedInquirerOutput = [];

switch (select) {
  case "View All Departments":
    returnedDbRows = await db.query(`Select * FROM department`);
    console.table(returnedDbRows[0]);
    break;

    case 'View All Roles':
      returnedDbRows = await db.query(`SELECT role.id, role.job_title, role.salary, department.department_name AS department 
      FROM role 
      JOIN department ON role.department_id = department.id`);
      console.table(returnedDbRows[0]);
      break;

      case 'View All Employees':
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
          returnedInquirerOutput = await inquirer.prompt([
            {
            name: 'department',
            message: 'Please enter a new department name: '
            },
          ]);

          try {
            // Check if the department exists
            const existingDepartment = db.query(
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
                message: 'Please Enter Department of New Role: ',
              },
            ]);

            const { roleName, roleSalary, roleDepartment } = returnedInquirerOutput;

            try {
              const returnDepartmentId = await db.query(`
                SELECT IFNULL((SELECT id FROM department WHERE name = '${roleDepartment}'), -1) AS department_id
              `);
          
              const department_id = returnDepartmentId[0].department_id;
          
              if (department_id === -1) {
                console.log('Please Enter a Role in an Existing Department.');
                break;
              }
          
              returnedDbRows = await db.query(`
                INSERT INTO role (job_title, salary, department_id)
                VALUES ('${roleName}', ${roleSalary}, ${department_id})
              `);
            } catch (error) {
              console.log('Error occurred:', error);
            }
            break;
          
            case "Add an Employee":
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

        const totalRoles = await db.query("select * from role;");

        const totalManagers = await db.query(
          "select * from employee where manager_id is null;"
        );

        const { first_name, last_name, role, manager } = returnedInquirerOutput;

        const role_data = totalRoles[0].filter((r) => {
          return r.title === role;
        });

        const manager_data = totalManagers[0].filter((m) => {
          return `${m.first_name} ${m.last_name}` === manager;
        });

        returnedDbRows = await db.query(
          `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${role_data[0].id}, ${manager_data[0].id})`
        );

        break;

      case "Update Employee Role":
        const currentEmployees = await db.query(`
                SELECT id, first_name, last_name FROM employee;`);

        const currentRoles = await db.query(`
                SELECT id, job_title FROM role;`);

        const employeeList = currentEmployees[0].map((employee) => {
          return {
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          };
        });

        const roleList = currentRoles[0].map((role) => {
          return {
            name: role.job_title,
            value: role.id,
          };
        });

        returnedInquirerOutput = await inquirer.prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Please Choose Which Employee to Update:",
            choices: employeeList,
          },
          {
            type: "list",
            name: "newRole",
            message: "Please Enter Employee's New Role:",
            choices: roleList,
          },
        ]);

        console.log(returnedInquirerOutput);

        returnedDbRows = await db.query(`
        UPDATE employee
        SET role_id = ${returnedInquirerOutput.newRole}
        WHERE employee.id = ${returnedInquirerOutput.employeeId};`);
        break;
    }
  } catch (err) {
    console.log(err);
  }
}

userPrompt();

async function userPrompt() {
  try {
    const res = await inquirer.prompt([
      {
        type: "list",
        name: "select",
        message: "What do you want to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          new inquirer.Separator(),
          "Quit",
        ],
      },
    ]);
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

userPrompt();