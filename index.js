import inquirer from 'inquirer'
import mysql from 'mysql2'
import TablePrompt from 'inquirer-table-prompt'
import cTable from 'table'
import chalk from 'chalk'


/*create a connection to the database*/
var connection = mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'',
    database:'employeetrack'
})

connection.connect(function(error){
    if(error) throw error;
    console.log('connected at '+connection.threadId+ "\n");
    mainMenu()
})

//CREATE A EMLOYEE DATA QUERY
function empQuery(){
    connection.query("SELECT * FROM employees", function(error,results){
        if(error) throw error;
        console.log('\n', results);
        clearEmployee();
    })
}

//create a department data query
function depQuery(){
    connection.query("SELECT * FROM department", function(error,results){
        if(error) throw error;
        console.log("Departments", results);
        mainMenu();
    })
}

//delete al employees
function delEmployee(){
    connection.query("TRUNCATE TABLE employees", function(error,results){
        if(error) throw error;
        console.log("Data deleted successfully");
        mainMenu();
    })
}

//create a query collector for roles
function rolQuery(){
    connection.query("SELECT * FROM roles", function(error,results){
        if(error) throw error;
        console.log("Roles", results);
        mainMenu()
    })
}


//create our main menu
function mainMenu(){
    console.log(chalk.green("=====MAIN MENU====="));
    console.log(chalk.yellow("=====Welcome To Employee Tracker====="));
    
    inquirer.prompt([
        {
            type:'list',
            name:'selectMenu',
            message:'choose among the options below',
            choices:['Add a new department',
            'add new role',
            'add manager',
            'Add new Employee',
            'update employee',
            'View employees',
            'View Roles',
            'View Departments',
            'delete employee',
            'delete department',
            'back to menu'],
        }
    ]).then(({selectMenu}) =>{
        //create acse scenario
        switch(selectMenu){
            case "Add a new department":
                addDept();
                break;
            case "Add new Employee":
                console.clear();
                addEmployee();
                break;
            case "add manager":
                console.clear();
                addManager();
                break;                
            case "add new role":
                console.clear();
                addRole();
                break;
            case "View employees":
                console.clear();
                empQuery();
                break;
            case "View Roles":
                console.clear();
                rolQuery();
                break;
            case "View Departments":
                console.clear();
                depQuery();
                break;
            case "delete employee":
                console.clear();
                removeEmployee();
                break;
            case "delete department":
                console.clear();
                removeDepartment();
                break;
            case 'update employee':
                console.clear();
                updateEmployee();
                break;
            case "back to menu":
                console.clear();
                mainMenu();


        }
    })
}

//add department
function addDept(){
    inquirer
    .prompt([
        {
            type:'input',
            name:'dept',
            message:'Enter department name: ',
            validate:(answers) => {
                if(answers === ''){
                    return 'please enter a dePT name'
                }
                return true
            }
        },
    ]).then(function(answers){
        console.log(answers);
        connection.query("INSERT INTO department SET ?",{
            department_name:answers.dept,
        },
        function(error){
            if(error) throw error;
            console.log("department saved");
            depQuery();
            mainMenu();
        }
        
        )
    })
}

//Add a role
//job title, role id, the department that role belongs to, and the salary for that role
function addRole(){
    connection.query("SELECT * FROM department;", (error, results) => {
        if(error) throw error;
        let departments = results.map(department => ({name:department.department_name}));
    
    inquirer.prompt([
        /*{
            type:'input',
            name:'roleid',
            message:'enter role ID: ',
            validate:(answers) =>{
                if(answers === ''){
                    return 'enter a valid role id'
                }
                return true
            }
        },
        */
        {
            type:'input',
            name:'jtitle',
            message:'enter job title: ',
            validate:(answers) =>{
                if(answers === ''){
                    return 'enter a valid job name'
                }
                return true
            }
        },
        {
            type:'input',
            name:'roleid',
            message:'enter role id: ',
            validate:(answers) =>{
                if(answers === ''){
                    return 'enter a valid role name'
                }
                return true
            }
        },
        {
            type: 'checkbox',
            message: 'Select users',
            name: 'department',
            choices: departments,
        },
        {
            type:'input',
            name:'salary',
            message:'Role salary: ',
            validate:(answers) => {
                if(isNaN(answers)){
                    return 'please enter valid number'
                }
                return true
            }
        },

    ]).then(function(answers){
        console.log(answers);
        connection.query("INSERT INTO roles SET ?", {
            
            jobTitle:answers.jtitle,
            RoleId:answers.roleid,
            department:answers.department,
            salaries:answers.salary,
            
        }),
        function(error){
            if(error) throw error;
            console.log('role saved successfully');
            rolQuery(),
            mainMenu();
        }
    });
})
};

//delete emloyeemenu
function clearEmployee(){
    inquirer.prompt([
        {
            type:'list',
            name:'delmenu',
            message:'choose action',
            choices:['delete all employees','back to menu'],
        }
    ])
    .then(({delmenu})=>{
        switch(delmenu){
            case "delete all employees":
                delEmployee();
                console.clear();
                break;
            case "back to menu":
                console.clear();
                mainMenu();
                break;
        }
    })
}

//collect managers
function viewData(){
    inquirer.prompt([
        {
            type:'list',
            name:'empmenu',
            message:'choose action',
            choices:['view details','back to menu'],
        }
    ])
    .then(({empmenu})=>{
        switch(empmenu){
            case "view details":
                empQuery();
                mainMenu();
                break;
            case "back to menu":
                console.clear();
                mainMenu();
                break;
        }
    })
}

//back to main menu function
function btmMenu(){
    inquirer.prompt([
        {
            type:'list',
            name:'btmm',
            message:'choose action',
            choices:['back to menu'],
        }
    ])
    .then(({btmm})=>{
        switch(btmm){
            
            case "back to menu":
                console.clear();
                mainMenu();
                break;
        }
    })
}
//add employee
function addEmployee(){
    connection.query("SELECT * FROM managers;",(error,results)=>{
        if (error) throw error;
        let managers = results.map(managers => ({name:managers.first_name}));
        

    });
    connection.query("SELECT * FROM department;",(error,results)=>{
        if (error) throw error;

        let departments = results.map(department => ({name:department.department_name}));
       
        
    
    


    inquirer
  .prompt([
    /* Pass your questions in here */
    {
        type:'input',
        name:'fname',
        message:'Enter first name: ',
        validate:(answers) => {
            if(answers === ''){
                return 'please enter a name'
            }
            return true
        }
    },
    {
        type:'input',
        name:'lname',
        message:'Enter last name: ',
        validate:(answers) => {
            if(answers === ''){
                return 'please enter a name'
            }
            return true
        }
    },
    {
        type:'input',
        name:'jtitle',
        message:'Enter Job Title: ',
        validate:(answers) => {
            if(answers === ''){
                return 'please enter valid title'
            }
            return true
        }
    },
    {
        type: 'list',
        message: 'select department',
        name: 'department',
        choices: departments,
    },
    {
        type:'input',
        name:'salary',
        message:'How much salary do you earn: ',
        validate:(answers) => {
            if(isNaN(answers)){
                return 'please enter valid number'
            }
            return true
        }
    },
    
    {
        type:'input',
        name:'mngr',
        message:'enter name of manager: ',
        validate:(answers) => {
            if(answers === ''){
                return 'please enter valid title'
            }
            return true
        }
    },
    
    
    
  ])
  .then(function(answers){
    console.log(answers);
    connection.query("INSERT INTO employees SET ?",{
        firstname:answers.fname,
        lastname:answers.lname,
        jobTitle:answers.jtitle,
        salaries:answers.salary,
        department:answers.department,
        manager:answers.mngr,
    },
    function(error){
        if(error) throw error;
        console.log("data saved");

        viewData();
    }
    
    )
});
})
}

//add manager
function addManager(){
    connection.query("SELECT * FROM department;",(error,results)=>{
        if (error) throw error;

        let departments = results.map(department => ({name:department.department_name}));
    
    


    inquirer
  .prompt([
    /* Pass your questions in here */
    {
        type:'input',
        name:'fname',
        message:'Enter first name: ',
        validate:(answers) => {
            if(answers === ''){
                return 'please first a name'
            }
            return true
        }
    },
    {
        type:'input',
        name:'lname',
        message:'Enter last name: ',
        validate:(answers) => {
            if(answers === ''){
                return 'please enter a name'
            }
            return true
        }
    },
    
    {
        type: 'list',
        message: 'select department',
        name: 'dept',
        choices: departments,
    },
    
    
    
    
  ])
  .then(function(answers){
    console.log(answers);
    connection.query("INSERT INTO managers SET ?",{
        first_name:answers.fname,
        last_name:answers.lname,
        
        department:answers.dept,
        
    },
    function(error){
        if(error) throw error;
        console.log("data saved");
        mainMenu();
    }
    
    )
});
})
}

//REMOVE DEPARTMENT
function removeDepartment(){
    connection.query(`SELECT * FROM department;`, (error, results) => {
        
        if (error) throw error;
        
        let departments = results.map(department => ({name: department.department_name, value: department.id }));
       
        inquirer.prompt([
            {
            name: 'deptName',
            type: 'list',
            message: 'Which department would you like to remove?',
            choices: departments
            },
        ])
        .then((answers) => {
            connection.query(`DELETE FROM department WHERE ?`, 
            [
                {
                    id: answers.deptName,
                },
            ], 
            (error, results) => {
                if (error) throw err;
                console.log(`\n Successfully removed the department from the database! \n`);
                mainMenu();
            })
        })
    })
}

//remove employees
//REMOVE DEPARTMENT
function removeEmployee(){
    connection.query(`SELECT * FROM employees;`, (error, results) => {
        
        if (error) throw error;
        
        let employees = results.map(employees => ({name: employees.firstname, value: employees.id }));
        
       
        inquirer.prompt([
            {
            name: 'ename',
            type: 'list',
            message: 'Which employee would you like to remove?',
            choices: employees
            },
        ])
        .then((answers) => {
            connection.query(`DELETE FROM employees WHERE ?`, 
            [
                {
                    id: answers.ename,
                },
            ], 
            (error, results) => {
                if (error) throw err;
                console.log(`\n Successfully removed the employee from the database! \n`);
                mainMenu();
            })
        })
    })
};

function updateEmployee(){
    connection.query(`SELECT * FROM employees;`, (error, results) => {
        if (error) throw error;
        
        let employees = results.map(employees => ({name: employees.firstname.lastname, value: employees.id }));
        
        inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'Which employee would you like to update?',
                choices: [employees,'back to main menu']
            },
            
            {
                name: 'newManager',
                type: 'input',
                message: "What should the employee's new name?",
                choices: [employees,'back to main menu']
            },
        ])
        .then((answers) => {
            connection.query(`UPDATE employees SET ? WHERE ?`, 
            [
                {
                    firstname: answers.newManager,
                },
                {
                    id: answers.employee,
                },
            ], 
            (error, results) => {
                if (error) throw error;
                console.log(`\n Successfully updated employee' \n`);
                mainMenu();
            })
        })
        
    })
};



