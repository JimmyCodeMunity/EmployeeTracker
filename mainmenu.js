import inquirer from 'inquirer'
import mysql from 'mysql2'


/*create a connection with the database*/
var connection = mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'',
    database:'employeeTrack'
})

connection.connect(function(error){
    if(error) throw error;
    console.log("connected at " +connection.threadId+"\n");
    mainMenu()
})





function querying(){
    connection.query("SELECT * FROM userdata", function(error, results){
        if(error) throw error;
        console.log("results:",results);
        connection.end();
        inquirer
        .prompt([
            {
                type: "list",
                name: "menu2",
                message: "Please choose one of the following options:",
                choices: [
                  "create new user",
                  "update employee",
                  "Exit",
                ],
                default: "Exit",
              },

        ]).then(({menu2}) => {
            switch(menu2){
                case "Exit":
                    console.clear();
                    exit();
                    mainMenu();
                    break;
                case "create new user":
                    console.clear();
                    exit();
                    addQuiz();
                    break;
            }
        });
    })
}


function mainMenu() {
    console.log("Welcome to Employee Tracker v1!");
    console.log(".::MAIN MENU::.");
    inquirer
      .prompt([
        {
          type: "list",
          name: "menuSelect",
          message: "Please choose one of the following options:",
          choices: [
            "fill in data",
            "add employee",
            "add department",
            "add role",
            "View All Employees",
            "Exit",
          ],
          default: "View All Employees",
        },
      ])
      .then(({ menuSelect }) => {
        switch (menuSelect) {
          case "fill in data":
            addQuiz();
            break;
            case "View All Employees":
            console.clear();
            querying();
            break;
            case "add department":
                console.clear();
                addDepartment();
                break;
          case "Exit":
            console.clear();
            exit();
            break;
        }
      });
  }


function addQuiz(){
    inquirer.prompt([
            {
                type:'input',
                name:'name',
                message:'whats your name?'
            },
            {
                type:'list',
                name:'experience',
                message:'how many years have you worked here',
                choices:[1,2,3,4,5,6]
            },
            {
                type:'input',
                name:'roles',
                message:'What is your role?',
                validate:(answers) => {
                    if(answers === ''){
                        return 'please enter a role before you continue'
                    }
                    return true

                }
            },
            {
                tyoe:'input',
                name:'salary',
                message:'salary paid: ',
                validate:(answers) =>{
                    if(isNaN(answers)){
                        return 'salary cannot be text'
                    }
                    return true
                }
            }

        ]).then(function(answers){
            console.log(answers);
            connection.query("INSERT INTO userdata SET ?",{
                name:answers.name,
                Experience:answers.experience,
                role:answers.roles,
                salary:answers.salary,
            },
            function(error){
                if(error) throw error;
                console.log("added to table");
                connection.end();
                inquirer
                .prompt([
                    {
                        type:'list',
                        name:'menu3',
                        message:"select",
                        choices:['back to menu','exit'],
                    }
                ]).then(({menu3})=>{
                    switch(menu3){
                        case "back to menu":
                            mainMenu();
                            break;
                    }
                })
            });
        })

}

function addDepartment(){
    console.log("====ADD NEW DEPARTMENT====");
    inquirer.prompt([
            {
                type:'input',
                name:'dept_name',
                message:'Enter department name:'
            },
            
        ]).then(function(answers){
            console.log(answers);
            connection.query("INSERT INTO department SET ?",{
                department_name:answers.dept_name,
            },
            function(error){
                if(error) throw error;
                console.log("added to department table successfully");
                connection.end();
                inquirer
                .prompt([
                    {
                        type:'list',
                        name:'menu3',
                        message:"select",
                        choices:['back to menu','exit'],
                    }
                ]).then(({menu3})=>{
                    switch(menu3){
                        case "back to menu":
                            mainMenu();
                            break;
                    }
                })
            });
        })

}


function exit() {
    console.clear();
    console.log("Shutting down... hit ctrl + c and use 'npm start' to reboot");
  }
  