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

function add(values) {
  const query = `INSERT INTO employees (first_name, last_name, title_id, manager_id) VALUES (?, ?, ?, ?)`;

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
}

function viewAllRoles() {
  db.query(`SELECT r.title AS role, d.department_name AS department, r.salary FROM roles r JOIN departments d ON r.department_id = d.id;`, function (err, results) {
    console.log("\n");
    console.table(results);
    console.log("\n\n\n\n\n\n\n\n\n\n");
    mainMenu();
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
      inquirer
        .prompt([
          { type: 'input', name: 'first_name', message: 'Enter the first name of the employee:' },
          { type: 'input', name: 'last_name', message: 'Enter the last name of the employee:' },
          { type: 'input', name: 'title_id', message: 'Enter the title ID of the employee:' },
          { type: 'input', name: 'manager_id', message: 'Enter the manager ID of the employee (leave blank if none):' },
        ])
        .then(answers => {
          const { first_name, last_name, title_id, manager_id } = answers;
          const values = [first_name, last_name, title_id, manager_id];
          add(values);
        });
      break;
    case "viewAllRoles":
      viewAllRoles();
      break;
    case "viewAllDepartments":
      viewAllDepartments();
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
