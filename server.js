var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");
require("dotenv").config();

class Database {
  constructor(config) {
    this.connection = mysql.createConnection(config);
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);

        resolve(rows);
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

const db = new Database({
  host: "localhost",
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  insecureAuth: true,
});



function start() {
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "start",
        messages:
          "Would you like to view tables? Add to tables? Or update tables?",
        choices: ["view", "add", "update"],
      },
    ])
    .then(function (answers) {
      if (answers.start === "view") {
        view();
      } else if (answers.start === "add") {
        add();
      } else {
        update();
      }
    });
}

function view() {
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "viewTables",
        message: "Would you like to view the tables?",
        choices: ["Departments", "Role", "Employees"],
      },
    ])
    .then(function (answers) {
      console.log(answers);
      if (answers.viewTables === "Departments") {
        db.query("SELECT * FROM department").then(function (departmentData) {
          console.table(departmentData);
          db.close();
        });
      } else if (answers.viewTables === "Role") {
        db.query("SELECT * FROM role").then(function (roleData) {
          console.table(roleData);
          db.close();
        });
      } else {
        db.query("SELECT * FROM employee").then(function (employeeData) {
          console.table(employeeData);
          db.close();
        });
      }
    });
}

function add() {
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "viewTables",
        message: "Which table would you like to add to?",
        choices: ["Departments", "Role", "Employees"],
      },
    ])
    .then(function (answers) {
      if (answers.viewTables === "Departments") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "departmentInput",
              message: "Please add a department",
            },
          ])
          .then(function (answers) {
            db.query("INSERT INTO department SET name = ?", [
              answers.departmentInput,
            ]);
          });

      } else if (answers.viewTables === "Role") {
        db.query("SELECT * FROM department").then(
            function (departmentData) {
                   var choicesArray = [];
                   for (i = 0; i < departmentData.length; i++) {
                   var choicesObject = {
                       name: departmentData[i].name,
                       value: departmentData[i].id,
                    };
                    choicesArray.push(departmentData[i].id)
                  }
          
                  inquirer
                  .prompt([
                    {
                      type: "input",
                      name: "titleInput",
                      message: "what is the title of role?",
                    },
                    {
                      type: "input",
                      name: "salaryInput",
                      message: "what is the salary for the role?",
                    },
                    {
                      type: "rawlist",
                      name: "depidInput",
                      message: "what is the department id of the role?",
                      choices: choicesArray
                    },
                  ])
                  .then(function (answers) {
                    db.query("INSERT INTO role SET ?", {
                      title: answers.titleInput,
                      salary: answers.salaryInput,
                      department_id: answers.depidInput,
                    }).then(function(departmentData){
                        // console.table(departmentData)
                        db.close()
                    })
                  })
               
                
              }) 
        
      } else{
          db.query("SELECT * FROM role").then(
              function(roleData){
                  var choicesArray = [];
                  for (i = 0; i < roleData.length; i++){
                  var choicesObject = {
                      name:roleData[i].title,
                      value:roleData[i].id
                  }
                  choicesArray.push(roleData[i].id) 
                  }
                inquirer.prompt([
                    {
                        type:"input",
                        name:"employeeFirstName",
                        message: "What is the employees first name?"
                    },
                    {
                        type:"input",
                        name:"employeeLastName",
                        message: "What is the employees Last name?"
                    },
                    {
                        type:"input",
                        name:"employeeManagerId",
                        message: "What is the manager's id?" 
                    },
                    {
                        type:"rawlist",
                        name:"employeeRoleId",
                        message: "What is their role id?",
                        choices: choicesArray
                    },

                ]).then(function(answers){
                    db.query("INSERT INTO employee SET?",{
                        first_name: answers.employeeFirstName,
                        last_name: answers.employeeLastName,
                        manager_id: answers.employeeManagerId,
                        role_id: answers.employeeRoleId
                    }).then(function(roleData){
                        console.log("Updated employee table")
                        db.close()
                    })
                })  
              }

          )
      }
    })
}

function update(){
    db.query("SELECT * FROM employee").then(
        function(employeeData){
            var choicesArray = []
            for (i = 0; i < employeeData.length; i++){
                var choicesObject = {
                    name: employeeData[i].id,
                    value:employeeData[i].first_name
                }
                choicesArray.push(employeeData[i].first_name)
            }
            inquirer.prompt([
                {
                    type:"rawlist",
                    name: "viewEmployees",
                    message: "Which employee would you like to promote?",
                    choices:choicesArray

                }
            ]).then(function(answers){
                if (answers.viewEmployees === choicesArray[i]){
                    inquirer.prompt([
                        {
                            type:"input",
                            name: "employeeRoleUpdate",
                            message: "Please indicate which role id you would like to promote them to"
                        }
                    ]).then(function(answers){
                        db.query("UPDATE employee SET ? WHERE ?", {
                           role_id: answers.employeeRoleUpdate
                            
                        }).then(function(employeeData){
                            console.log("Update employee role id")
                            db.close()
                        })

                        
                    })
                }
            })

        }
    )
}

start()
