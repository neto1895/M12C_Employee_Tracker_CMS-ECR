const logo = require('asciiart-logo');
const config = require('./package.json');
const inquirer = require('inquirer');
const mysql = require('mysql2');

console.log(logo(config).render());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'AsMySQL.2211',
  database: 'employee_management_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the employees_db database.');
});

const options = [
  { name: "View All Employees", value: "viewAll" },
  { name: "View All Employees by Department", value: "viewAllbyDepartment" },
  { name: "View All Employees by Manager", value: "viewAllbyManager" },
  { name: "Add Employee", value: "add" },
  { name: "Remove Employee", value: "remove" },
  { name: "Update Employee Role", value: "updateRole" },
  { name: "Update Employee Manager", value: "updateManager" },
  { name: "View All Roles", value: "viewAllRoles" },
  { name: "Add Role", value: "addRole" },
  { name: "Remove Role", value: "removeRole" },
  { name: "View All Departments", value: "viewAllDepartments" },
  { name: "Add Department", value: "addDepartment" },
  { name: "Remove Department", value: "removeDepartment" },
  { name: "View Total Utilized Budget By Department", value: "viewAllBudget" },
  { name: "Quit", value: "quit" }
];

function viewAll() {
  db.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employees e JOIN roles r ON e.title_id = r.id LEFT JOIN departments d ON r.department_id = d.id LEFT JOIN employees m ON e.manager_id = m.id ORDER BY e.id ASC;`, function (err, results) {
    console.log("\n");
    console.table(results);
    console.log("\n\n\n\n\n\n\n\n\n\n");
    mainMenu();
  });

}

function viewAllbyDepartment() {
  db.query(`SELECT e.id, e.first_name, e.last_name, d.department_name FROM employees e JOIN roles r ON e.title_id = r.id JOIN departments d ON r.department_id = d.id ORDER BY d.department_name;`, function (err, results) {
    console.log("\n");
    console.table(results);
    console.log("\n\n\n\n\n\n\n\n\n\n");
    mainMenu();
  });
}

function viewAllbyManager() {
  db.query(`SELECT e.id, e.first_name, e.last_name, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees e LEFT JOIN employees m ON e.manager_id = m.id ORDER BY manager_name;`, function (err, results) {
    console.log("\n");
    console.table(results);
    console.log("\n\n\n\n\n\n\n\n\n\n");
    mainMenu();
  });
}

function add() {
  // Fetch the list of titles from the database
  db.query('SELECT * FROM roles', (error, titleResults) => {
    if (error) {
      console.error('Error occurred while fetching titles:', error);
      mainMenu();
      return;
    }

    // Fetch the list of employees from the database
    db.query('SELECT * FROM employees', (error, employeeResults) => {
      if (error) {
        console.error('Error occurred while fetching employees:', error);
        mainMenu();
        return;
      }

      // Map the title and employee results to arrays of choices
      const titleChoices = titleResults.map(title => ({ name: title.title, value: title.id }));
      const managerChoices = [
        { name: 'None', value: null }, // Option for "None" if the employee will not have a manager
        ...employeeResults.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
      ];

      inquirer
        .prompt([
          { type: 'input', name: 'first_name', message: 'Enter the first name of the employee:' },
          { type: 'input', name: 'last_name', message: 'Enter the last name of the employee:' },
          { type: 'list', name: 'title_id', message: 'Select the title of the employee:', choices: titleChoices },
          { type: 'list', name: 'manager_id', message: 'Select the manager of the employee:', choices: managerChoices },
        ])
        .then(answers => {
          const { first_name, last_name, title_id, manager_id } = answers;
          const values = [first_name, last_name, title_id, manager_id];
          const query = 'INSERT INTO employees (first_name, last_name, title_id, manager_id) VALUES (?, ?, ?, ?)';

          db.query(query, values, (error, results) => {
            if (error) {
              console.error('Error occurred while adding the employee:', error);
            } else {
              console.log('New employee added:');
              console.log('First Name:', values[0]);
              console.log('Last Name:', values[1]);
              console.log('Title ID:', values[2]);
              console.log('Manager ID:', values[3] || 'None');
            }

            mainMenu();
          });
        })
        .catch(error => {
          console.error('Error occurred:', error);
          mainMenu();
        });
    });
  });
}

function removeEmployee() {
  // Fetch the list of employees from the database
  db.query("SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employees", function (err, results) {
    if (err) {
      console.error('Error occurred while fetching employees:', err);
      mainMenu();
      return;
    }

    // Create a list of choices for the prompt
    const employeeChoices = results.map((employee) => ({
      name: employee.full_name,
      value: employee.id.toString(),
    }));

    // Prompt the user to select an employee to delete
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select the employee to delete:',
          choices: employeeChoices,
        },
        {
          type: 'confirm',
          name: 'confirmDelete',
          message: 'Are you sure you want to delete this employee?',
          default: false,
        },
      ])
      .then(({ employeeId, confirmDelete }) => {
        if (confirmDelete) {
          // Perform the database query to delete the employee
          const query = 'DELETE FROM employees WHERE id = ?';

          db.query(query, [employeeId], (error, result) => {
            if (error) {
              console.error('Error occurred while deleting the employee:', error);
            } else {
              console.log('Employee deleted successfully.');
            }

            mainMenu();
          });
        } else {
          console.log('Deletion canceled.');
          mainMenu();
        }
      })
      .catch((error) => {
        console.error('Error occurred:', error);
        mainMenu();
      });
  });
}

function updateEmployeeRole() {
  // Fetch the list of employees from the database
  db.query("SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employees", function (err, results) {
    if (err) {
      console.error('Error occurred while fetching employees:', err);
      mainMenu();
      return;
    }

    // Create a list of choices for the prompt
    const employeeChoices = results.map((employee) => ({
      name: employee.full_name,
      value: employee.id.toString(),
    }));

    // Prompt the user to select an employee to update
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select the employee to update:',
          choices: employeeChoices,
        },
        {
          type: 'input',
          name: 'newRoleId',
          message: 'Enter the new role ID for the employee:',
        },
      ])
      .then(({ employeeId, newRoleId }) => {
        // Perform the database query to update the employee's role
        const query = 'UPDATE employees SET title_id = ? WHERE id = ?';

        db.query(query, [newRoleId, employeeId], (error, result) => {
          if (error) {
            console.error('Error occurred while updating the employee role:', error);
          } else {
            console.log('Employee role updated successfully.');
          }

          mainMenu();
        });
      })
      .catch((error) => {
        console.error('Error occurred:', error);
        mainMenu();
      });
  });
}

function updateManager() {
  // Fetch the list of employees from the database
  db.query('SELECT * FROM employees', (error, results) => {
    if (error) {
      console.error('Error occurred while fetching employees:', error);
      mainMenu();
      return;
    }

    // Map the results to an array of employee names
    const employeeNames = results.map(employee => `${employee.first_name} ${employee.last_name}`);

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeName',
          message: 'Select the employee to update:',
          choices: employeeNames,
        },
        {
          type: 'list',
          name: 'managerName',
          message: 'Select the new manager:',
          choices: [...employeeNames, 'None'], // Include an option for "None" if the employee will not have a manager
        },
      ])
      .then(answers => {
        const employeeName = answers.employeeName;
        const managerName = answers.managerName;

        // Get the employee and manager IDs based on the selected names
        const employee = results.find(employee => `${employee.first_name} ${employee.last_name}` === employeeName);
        const manager = managerName === 'None' ? null : results.find(employee => `${employee.first_name} ${employee.last_name}` === managerName);

        // Update the employee's manager in the database
        db.query('UPDATE employees SET manager_id = ? WHERE id = ?', [manager ? manager.id : null, employee.id], (error, results) => {
          if (error) {
            console.error('Error occurred while updating the employee manager:', error);
          } else {
            console.log('Employee manager updated successfully.');
          }

          mainMenu();
        });
      })
      .catch(error => {
        console.error('Error occurred:', error);
        mainMenu();
      });
  });
}

function viewAllRoles() {
  db.query(`SELECT r.title AS role, d.department_name AS department, r.salary FROM roles r JOIN departments d ON r.department_id = d.id;`, function (err, results) {
    console.log("\n");
    console.table(results);
    console.log("\n\n\n\n\n\n\n\n\n\n");
    mainMenu();
  });
}

function addRole() {
  // Fetch the list of departments from the database
  db.query('SELECT * FROM departments', (error, departmentResults) => {
    if (error) {
      console.error('Error occurred while fetching departments:', error);
      mainMenu();
      return;
    }

    // Map the department results to an array of choices
    const departmentChoices = departmentResults.map(department => ({ name: department.department_name, value: department.id }));

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the title of the new role:',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary of the new role:',
        },
        {
          type: 'list',
          name: 'department_id',
          message: 'Select the department of the new role:',
          choices: departmentChoices,
        },
      ])
      .then(answers => {
        // Handle the new role data here
        const { title, salary, department_id } = answers;

        // Perform the database query to insert the new role
        const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
        const values = [title, salary, department_id];

        db.query(query, values, (error, results) => {
          if (error) {
            console.error('Error occurred while adding the role:', error);
          } else {
            console.log('New role added:');
            console.log('Title:', title);
            console.log('Salary:', salary);
            console.log('Department ID:', department_id);
          }

          mainMenu();
        });
      })
      .catch(error => {
        console.error('Error occurred:', error);
        mainMenu();
      });
  });
}

function removeRole() {
  // Fetch the list of roles from the database
  db.query('SELECT * FROM roles', (error, results) => {
    if (error) {
      console.error('Error occurred while fetching roles:', error);
      mainMenu();
      return;
    }

    // Prompt the user to select a role to remove
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'roleId',
          message: 'Select the role to remove:',
          choices: results.map(role => ({ name: role.title, value: role.id })),
        },
      ])
      .then(answer => {
        const roleId = answer.roleId;

        // Delete the selected role from the database
        db.query('DELETE FROM roles WHERE id = ?', [roleId], (error, results) => {
          if (error) {
            console.error('Error occurred while removing the role:', error);
          } else {
            console.log('Role removed successfully.');
          }

          mainMenu();
        });
      })
      .catch(error => {
        console.error('Error occurred:', error);
        mainMenu();
      });
  });
}


function viewAllDepartments() {
  db.query(`SELECT  d.id AS DepartmentID, d.department_name AS Department FROM departments d ORDER BY DepartmentID;`, function (err, results) {
    console.log("\n");
    console.table(results);
    console.log("\n\n\n\n\n\n\n\n\n\n");
    mainMenu();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:',
      },
    ])
    .then(answer => {
      const departmentName = answer.departmentName;

      // Insert the new department into the database
      db.query('INSERT INTO departments (department_name) VALUES (?)', [departmentName], (error, results) => {
        if (error) {
          console.error('Error occurred while adding the department:', error);
        } else {
          console.log('Department added successfully.');
        }

        mainMenu();
      });
    })
    .catch(error => {
      console.error('Error occurred:', error);
      mainMenu();
    });
}

function removeDepartment() {
  // Fetch the list of departments from the database
  db.query('SELECT * FROM departments', (error, results) => {
    if (error) {
      console.error('Error occurred while fetching departments:', error);
      mainMenu();
      return;
    }

    // Map the results to an array of department names
    const departmentNames = results.map(department => department.department_name);

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'departmentName',
          message: 'Select the department to remove:',
          choices: departmentNames,
        },
      ])
      .then(answer => {
        const departmentName = answer.departmentName;

        // Delete the selected department from the database
        db.query('DELETE FROM departments WHERE department_name = ?', [departmentName], (error, results) => {
          if (error) {
            console.error('Error occurred while removing the department:', error);
          } else {
            console.log('Department removed successfully.');
          }

          mainMenu();
        });
      })
      .catch(error => {
        console.error('Error occurred:', error);
        mainMenu();
      });
  });
}

function viewAllBudget() {
  db.query(`SELECT d.department_name, SUM(r.salary) AS total_budget FROM employees e JOIN roles r ON e.title_id = r.id LEFT JOIN departments d ON r.department_id = d.id GROUP BY d.department_name;`, function (err, results) {
    console.log("\n");
    console.table(results);
    console.log("\n\n\n\n\n\n\n\n\n\n");
    mainMenu();
  });
}

const mainMenu = () => {
  inquirer.prompt([
    { type: "list", name: "menu", message: "What would you like to do?", choices: options }
  ])
    .then(({ menu }) => {
      selectedOption(menu);
    });
};

const selectedOption = (menu) => {
  switch (menu) {
    case "viewAll":
      viewAll();
      break;
    case "viewAllbyDepartment":
      viewAllbyDepartment();
      break;
    case "viewAllbyManager":
      viewAllbyManager();
      break;
    case "add":

          add();

      break;
    case "remove":
      removeEmployee();
      break;

      case "updateRole":
        updateEmployeeRole();
        break;

        case "updateManager":
          updateManager();
          break;

    case "viewAllRoles":
      viewAllRoles();
      break;

      case "addRole":
        addRole();
        break;

        case "removeRole":
          removeRole();
          break;

    case "viewAllDepartments":
      viewAllDepartments();
      break;

      case "addDepartment":
        addDepartment();
        break;

        case "removeDepartment":
          removeDepartment();
          break;

    case "viewAllBudget":
      viewAllBudget();
      break;
    case "quit":
      console.log('Goodbye! See you soon!');
      db.end();
      process.exit();
  }
};

mainMenu();
