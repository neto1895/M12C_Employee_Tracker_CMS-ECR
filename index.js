const logo = require('asciiart-logo');
const config = require('./package.json');
const inquirer = require('inquirer'); // Package for prompting user input
const fs = require('fs'); // File system module

console.log(logo(config).render());

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

const menu = () => {
    return inquirer.prompt([
        {
        type: "list",  
        name: "menu",     
        message: "What would you like to do?",        
        choices: options,

        }
    ])
}



function init(){
menu()
.then((menuOption) => {
    console.log(menuOption);
}

)
}
init(); // Function call to initialize app