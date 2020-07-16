var mysql = require('mysql')
var inquirer = require('inquirer')
var cTable = require('console.table');
require('dotenv').config()

class Database {
  constructor( config ) {
      this.connection = mysql.createConnection( config );
  }
  query( sql, args ) {
      return new Promise( ( resolve, reject ) => {
          this.connection.query( sql, args, ( err, rows ) => {
              if ( err )
                  return reject( err );
              
              resolve( rows );
          } );
      } );
  }
  close() {
      return new Promise( ( resolve, reject ) => {
          this.connection.end( err => {
              if ( err )
                  return reject( err );
              resolve();
          } );
      } );
  }
}



const db = new Database({
  host: "localhost",
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  insecureAuth : true
});


function start(){
    inquirer.prompt(
        [
            {
                type:"rawlist",
                name:"start",
                messages: "Would you like to view tables? Add to tables? Or update tables?",
                choices: ["view", "add", "update"]
            }
        ]
    ).then(function(answers){
        if(answers.start === "view"){
            view();
        }
        else if(answers.start === "add"){
            add ();
        }
        else{
            update()
        }
    })

}
   

function view(){
    inquirer.prompt(
        [
            {
                type: "rawlist",
                name: "viewTables",
                message: "Would you like to view the tables?",
                choices: ["Departments", "Role", "Employees"]
            }
    
        ]
    ).then(function(answers){
        console.log(answers)
        if(answers.viewTables === "Departments"){
          db.query("SELECT * FROM department").then(
              function(departmentData){
              console.table(departmentData) 
              db.close()
              }
          )
         
    
        }else if(answers.viewTables === "Role"){
           db.query("SELECT * FROM role").then(
               function(roleData){
                console.table(roleData)
                db.close()
               }
           ) 
            
    
        }else{
           db.query("SELECT * FROM employee").then(
                    function(employeeData){
                    console.table(employeeData)
                    db.close()
                    }
                )
            
            
    
    
        }
    })

}


function add(){
    inquirer.prompt(
        [
            {
                type: "rawlist",
                name: "viewTables",
                message: "Which table would you like to add to?",
                choices: ["Departments", "Role", "Employees"]

            }
        ]
    ).then(function(answers){
        console.log(answers)
        if(answers.viewTables === "Departments"){
          db.query("SELECT * FROM department").then(
              function(departmentData){
              console.table(departmentData) 
              
              }
          )
         
    
        }else if(answers.viewTables === "Role"){
           db.query("SELECT * FROM role").then(
               function(roleData){
                console.table(roleData)
              
               }
           ) 
            
    
        }else{
           db.query("SELECT * FROM employee").then(
                    function(employeeData){
                    console.table(employeeData)
                    
                    }
                )
            
            
    
    
        }
    })
    

}

function update(){}

start();
