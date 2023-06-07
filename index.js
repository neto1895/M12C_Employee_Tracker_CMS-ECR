const logo = require('asciiart-logo');
const config = require('./package.json');
const inquirer = require('inquirer'); // Package for prompting user input
const fs = require('fs'); // File system module
const mysql = require('mysql2');
console.log(logo(config).render());


const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'AsMySQL.2211',
      database: 'employee_management_db'
    },
    console.log(`Connected to the employees_db database.`)
  );


const options = [
    {name: "View All Employees",               value: "viewAll"},
    {name: "View All Employees by Department", value: "viewAllbyDepartment"},
    {name: "View All Employees by Manager",    value: "viewAllbyManager"},
    {name: "Add Employee",                     value: "add"},
    {name: "Remove Employee",                  value: "remove"},
    {name: "Update Employee Role",             value: "updateRole"},
    {name: "Update Employee Manager",          value: "updateManager"},
    {name: "View All Roles",                   value: "viewAllRoles"},
    {name: "Add Role",                         value: "addRole"},
    {name: "Remove Role",                      value: "removeRole"},
    {name: "View All Departments",             value: "viewAllDepartments"},
    {name: "Add Department",                   value: "addDepartment"},
    {name: "Remove Department",                value: "removeDepartment"},
    {name: "View Total Utilized Budget By Department", value: "viewAllBudget"},
    {name: "Quit",                             value: "quit"}
]

const mainMenu = () => {
    inquirer.prompt([
      { type:"list", name:"menu", message:"What would you like to do?", choices: options,}
    ])
    .then((menuOption) => {
        selectedOption(menuOption);
    })
}
// function viewAll(){
//   db.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employees e JOIN roles r ON e.title_id = r.id LEFT JOIN departments d ON r.department_id = d.id LEFT JOIN employees m ON e.manager_id = m.id ORDER BY e.id ASC;`, function (err, results) {
//     console.log("\n");
//     console.table(results);
//     console.log("\n\n\n\n\n\n\n\n\n\n");
// });  
// }

// function viewAllbyDepartment(){
//   db.query(`SELECT e.id, e.first_name, e.last_name, d.department_name FROM employees e JOIN roles r ON e.title_id = r.id JOIN departments d ON r.department_id = d.id ORDER BY d.department_name;`, function (err, results) {
//     console.log("\n")
//     console.table(results);
//     console.log("\n\n\n\n\n\n\n\n\n\n") });
// }

// function viewAllbyManager(){
//   db.query(`SELECT e.id, e.first_name, e.last_name, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees e LEFT JOIN employees m ON e.manager_id = m.id ORDER BY manager_name;`, function (err, results) {
//     console.log("\n")
//     console.table(results);
//     console.log("\n\n\n\n\n\n\n\n\n\n")
//   });
// }

// function add(){
//   inquirer
//   .prompt([
//     {
//       type: 'input',
//       name: 'first_name',
//       message: 'Enter the first name of the employee:',
//     },
//     {
//       type: 'input',
//       name: 'last_name',
//       message: 'Enter the last name of the employee:',
//     },
//     {
//       type: 'input',
//       name: 'title_id',
//       message: 'Enter the title ID of the employee:',
//     },
//     {
//       type: 'input',
//       name: 'manager_id',
//       message: 'Enter the manager ID of the employee (leave blank if none):',
//     },
//   ])
//   .then(answers => {
//     // Handle the new employee data here
//     const { first_name, last_name, title_id, manager_id } = answers;

//     // Perform the database query to insert the new employee
//     const query = `INSERT INTO employees (first_name, last_name, title_id, manager_id) VALUES (?, ?, ?, ?)`;
//     const values = [first_name, last_name, title_id, manager_id];

//     db.query(query, values, (error, results) => {
//       if (error) {
//         console.error('Error occurred while adding the employee:', error);
//       } else {
//         console.log('New employee added:');
//         console.log('First Name:', first_name);
//         console.log('Last Name:', last_name);
//         console.log('Title ID:', title_id);
//         console.log('Manager ID:', manager_id || 'None');
//       }
//       // Close the database connection
//       db.end();
//       mainMenu();
//     });
//   })
  
//   .catch(error => {
//     console.error('Error occurred:', error);
//   });
// }

// function viewAllRoles(){
//   db.query(`SELECT r.title AS role, d.department_name AS department, r.salary FROM roles r JOIN departments d ON r.department_id = d.id;`, function (err, results) {
//     console.log("\n")
//     console.table(results);
//     console.log("\n\n\n\n\n\n\n\n\n\n")
//   });
// }

// function viewAllDepartments(){
//   db.query(`SELECT  d.id AS DepartmentID, d.department_name AS Department FROM departments d ORDER BY DepartmentID;`, function (err, results) {
//     console.log("\n")
//     console.table(results);
//     console.log("\n\n\n\n\n\n\n\n\n\n")
//   });
// }

// function viewAllBudget(){
//   db.query(`SELECT d.department_name, SUM(r.salary) AS total_budget FROM employees e JOIN roles r ON e.title_id = r.id LEFT JOIN departments d ON r.department_id = d.id GROUP BY d.department_name;`, function (err, results) {
//     console.log("\n")
//     console.table(results);
//     console.log("\n\n\n\n\n\n\n\n\n\n")
//   });
// }

const selectedOption = ({menu}) =>{
  const userChoice =require("./lib/dbQuerys");
  const selectedFunction = new userChoice();

    switch (menu) {
        case "viewAll":
          selectedFunction.viewAll();
          break;
        case "viewAllbyDepartment":
          selectedFunction.viewAllbyDepartment();
          break;
        case "viewAllbyManager":
          selectedFunction.viewAllbyManager();
          break;
        case "add":
          selectedFunction.add();
          break;
        // case "remove":
        //   remove();
        // break;
        // case "updateRole":
             
        // break;
        // case "updateManager":
             
        // break;
        case "viewAllRoles":
          selectedFunction.viewAllRoles();
        break;
        // case "addRole":
             
        // break;
        // case "removeRole":
             
        // break;
        case "viewAllDepartments":
          selectedFunction.viewAllDepartments();
        break;
        // case "addDepartment":
             
        // break;
        // case "removeDepartment":
             
        // break;
        case "viewAllBudget":
          selectedFunction.viewAllBudget();
        break;
        case "quit":
        break;            
        default:
        console.log("\n")
        break;
    }
;
}

function init(){
    mainMenu()

}
init(); // Function call to initialize app

module.exports = mainMenu;