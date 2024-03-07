const inq = require("inquirer");
const mysql = require('mysql2');
const util = require('util');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '',
      database: 'hr_db'
    },
    // console.log(`Connected to the classlist_db database.`)
  );

  const dbQuery = util.promisify(db.query).bind(db);

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
        console.log("Exit function called");
        choice = "Exit";
    } 
};

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

async function startMenu(){
     

    
        // Prompt the user
       
        const menu =  await inq.prompt({
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: Object.keys(functions)
        });
        
        // Call the selected function
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

async function addEmployee(){
};


async function updateEmployeeRole(){
};


async function viewRoles(){
};


async function addRole(){
};


async function viewDepartment(){
};


async function addDepartment(){
};

