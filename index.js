const inq = require("inquirer");
const mysql = require('mysql2');
const util = require('util');
require('dotenv').config();

console.log(process.env)

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: process.env.USER,
      // MySQL password
      password: '',
      database: process.env.DATABASE
    },
    // console.log(`Connected to the classlist_db database.`)
  );

// Promisify database queries
const dbQuery = util.promisify(db.query).bind(db);

//Menu options
const functions = {
    "View all employees": viewAllEmployees,
    "Add an employee": addEmployee,
    "Update an employee role": updateEmployeeRole,
    "View all roles": viewRoles,
    "Add a role": addRole,
    "View all departments": viewDepartment,
    "Add a department": addDepartment,
    "Exit application": () => {
        // Your code for exiting the application
        process.exit();
    } 
};

//Ensure Header "HR CMS" is printed once
function runOne() {
    let hasRun = false;
    return function(){
        if(hasRun) {
            startMenu();
            return;
        }

        console.log(`
        ██╗  ██╗██████╗      ██████╗███╗   ███╗███████╗
        ██║  ██║██╔══██╗    ██╔════╝████╗ ████║██╔════╝
        ███████║██████╔╝    ██║     ██╔████╔██║███████╗
        ██╔══██║██╔══██╗    ██║     ██║╚██╔╝██║╚════██║
        ██║  ██║██║  ██║    ╚██████╗██║ ╚═╝ ██║███████║
        ╚═╝  ╚═╝╚═╝  ╚═╝     ╚═════╝╚═╝     ╚═╝╚══════╝
                                                               `);
       
    
        hasRun = true;
        startMenu();  
    }
   
}
const runFunctionOnce = runOne();
runFunctionOnce();

// Menu Prompts
async function startMenu(){

        const menu =  await inq.prompt({
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: Object.keys(functions)
        });
        
        // Call the selected menu function
        await functions[menu.choice]();

        startMenu();
};




async function viewAllEmployees(){

    try{
        const result = await dbQuery('SELECT * FROM employee');
        console.table(result);        
    } catch(err) {
        console.log(err);
    } 
    
}

// Add Employee...obviously...should we only write comments for things that are possibly confusing? 
// Great cos thats what im going to do thnks
async function addEmployee(){
    try{
        const roles = await dbQuery('SELECT * FROM role');
        const roleChoices = roles.map(role => {
            return {
                name: role.title,
                value: role.id
            }
        });
     

        !roleChoices.length && console.log("No roles found. Please add a role first.");

        const prompts =  await inq.prompt([
            {
                type: "input",
                name: "firstName",
                message: "Employee First Name"
            },
            {
                type: "input",
                name: "lastName",
                message: "Employee Last Name"
            },
            {
                type: "list",
                name: "roleId",
                message: "Employee Role",
                choices: roleChoices
            },
            {
                type: "input",
                name: "managerId",
                message: "Manager Id (if applicable)"
            },
            
        ]);
        
        const {firstName, lastName, roleId, managerId} = prompts;
       
       

        const result = await dbQuery(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
         VALUES (?,?,?,?)`, [firstName, lastName, roleId, managerId]);
        
        console.log("Employee added successfully"); 

    } catch(err){
        console.log(err);
    }
   
};


async function updateEmployeeRole(){
    // Confused on what NEEDS to be wrapped in a try/catch
    let employees;
    let roleChoices;
    try{
        // Get Employees
        const employeeTable = await dbQuery('SELECT * FROM employee');
        
        employees = employeeTable.map(employee => {
            return {
                name: employee.first_name + " " + employee.last_name,
                value: employee.id
            }
        })
        
        // Get Roles
        const roles = await dbQuery('SELECT * FROM role');

        roleChoices = roles.map(role => {
            return {
                name: role.title,
                value: role.id
            }
        });
    } catch(err){
        console.log(err);
    }

    const prompts =  await inq.prompt([
        {
            type: "list",
            name: "employee",
            message: "Which employee to update:",
            choices: employees,
        },
        {
            type: "list",
            name: "roleId",
            message: "Which role will they have",
            choices: roleChoices,
        }
    ]);
    
    try{

        dbQuery('UPDATE employee SET role_id = ? WHERE id = ?', [ 
            prompts.roleId,
            prompts.employee
        ]);

        console.log("Employee role updated.");

    } catch(err){

    }
};


async function viewRoles(){
    try{
        const result = await dbQuery('SELECT * FROM role');
        console.table(result);        
    } catch(err) {
        console.log(err);
    }
};


async function addRole(){
    const roleName =  await inq.prompt({
        type: "input",
        name: "name",
        message: "What will the role be called?"
    });

    let salary = await inq.prompt({
        type: "input",
        name: "salary",
        message: "What is the salary?"
    });

    //Check if salary is num using regular expression 
    while(/^\d+$/.test(salary.salary) === false){ 
        
        salary = await inq.prompt({
            type: "input",
            name: "salary",
            message: "What is the salary?"
        });

    }

    // Get selection of departments
    const departments = await dbQuery('SELECT * FROM department');

    //Ensures 1 Department exists
    const departmentsChoices = departments.map(dep => {
        return {
            name: dep.name,
            value: dep.id
        }
    });
 

    !departmentsChoices.length && console.log("No roles found. Please add a department first.");

    const department = await inq.prompt({
        type: "list",
        name: "depId",
        message: "Please choose a department:",
        choices: departmentsChoices
    });


    
    // Check values exist
    if(department.depId && salary.salary && roleName.name){
        
        try {
            const response = await dbQuery('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [
                roleName.name,
                salary.salary,
                department.depId
            ]);
            console.log(roleName.name + " role added")
        } catch (err){
            console.log(err);
        }

        
    }



};


async function viewDepartment(){
    try{
        const result = await dbQuery('SELECT * FROM department');
        console.table(result);        
    } catch(err) {
        console.log(err);
    }
};


async function addDepartment(){
    const dep =  await inq.prompt({
        type: "input",
        name: "choice",
        message: "What shall we call the department?",
    });

    if(dep && dep.choice){
        try{
            dbQuery('INSERT INTO department (name) VALUES (?)', dep.choice);
            console.log("Department Created!");
        } catch(err){
            console.log(err);
        }
    }
};

