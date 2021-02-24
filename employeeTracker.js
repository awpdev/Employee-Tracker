const inquirer = require('inquirer');
const mysql = require('mysql');
require('console.table');
require('dotenv').config();

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.DBPASSWORD,
  database: "employeeDB"
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connection successful!\n----------------------------------\nWELCOME TO EMPLOYEE TRACKER\n----------------------------------\n');
  displayMainMenu();
})

function displayMainMenu() {
  inquirer
  .prompt(mainMenu)
  .then(function(answer) {
  
    switch (answer.actionInput) {
      case 'View All Employees':
        viewAllEmp();
        break;
      case 'View All Departments':
        viewAllDept();
        break;
      case 'View All Roles':
        viewAllRoles();
        break;
      case 'Add Employee':
        addEmp();
        break;
      case 'Add Department':
        addDept();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Update Employee Role':
        updateEmpRole();
        break;
      case 'Quit':
        connection.end();
        break;
    }
  });
}

// view all employees
const viewAllEmp = () => {
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    if (res.length === 0) {
      console.log('\nThere are no employees added yet.\n');
      displayMainMenu();
    } else {
      console.log('\nEmployees retrieved from database\n');
      console.table(res);
      displayMainMenu();
    }
  });
}
// view all departments
const viewAllDept = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    if (res.length === 0) {
      console.log('\nThere are no departments added yet.\n');
      displayMainMenu();
    } else {
      console.log('\nDepartments retrieved from database\n');
      console.table(res);
      displayMainMenu();
    }
  });

}
// view all roles
const viewAllRoles = () => {
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    if (res.length === 0) {
      console.log('\nNo Roles have been added yet.\n');
      displayMainMenu();
    } else {
      console.log('\nRoles retrieved from database\n');
      console.table(res);
      displayMainMenu();
    }
  });
}

// add to department table
function addDept() {
  inquirer
  .prompt(addDeptQuestions)
  .then(function(answer) {
    connection.query(
      'INSERT INTO department SET ?', {
        name: answer.deptName
      }, function(err, res) {
        if (err) throw err;
        console.log('\nDepartment added\n');
        viewAllDept();
        displayMainMenu();
        
      }
    );
  });
  
}

// add to role table
function addRole() {
  connection.query('SELECT * FROM department', function(err, res) {
    inquirer
    .prompt([
    {
      type: 'input',
      message: "\nPlease enter job title:",
      name: 'roleName'
    },
    {
      type: 'input',
      message: '\nPlease enter salary of role:',
      name: 'salary'
    },
    {
      type: 'list',
      message: "\nPlease select department this role falls under:",
      choices: function() {
        var choicesArr = [];
        res.forEach(dpt => {
          choicesArr.push(dpt.name);
        })
        return choicesArr;
      },
      name: 'roleDept'
    }
    ]).then(answer => {
      const dept = answer.roleDept;
      connection.query('SELECT * FROM department', function(err, res) {
        if (err) throw err;
        let filteredDept = res.filter(function(res) {
          return res.name == dept;
        })

        let id = filteredDept[0].id;
        let query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
        let values = [answer.roleName, parseInt(answer.salary), id];
        console.log(values);
        connection.query(query, values, function(err, res, fields) {
          if (err) throw err;
          console.table(res);
        })
      }) 
    });
  })
  displayMainMenu();
}

// add to employee table
// 
async function addEmp() {
  connection.query('SELECT * FROM role', function(err, res) {
    if (err) throw err;
    inquirer.
      prompt([
        {
        type: 'input',
        message: "\nEnter employee's first name:",
        name: 'firstName'
        }, {
        type: 'input',
        message: "\nEnter employee's last name:",
        name: 'lastName'
        }, {
        type: 'list',
        message: '\nSelect role of the employee',
        name: 'empRole',
        choices: function() {
          const rolesArr = [];
          res.forEach(role => {
            rolesArr.push(role.title);
          })
          return rolesArr;
        }
      }
    ])
      .then(function(answer) {
        console.log(answer);
        const role = answer.empRole;
        connection.query('SELECT * FROM role', function(err, res) {
          if (err) throw err;
          let getId = res.filter(function(res) {
            return res.title = role;
          })
          let roleId = getId[0].id;

          let query = 'INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)';
          let vals = [answer.firstName, answer.lastName, roleId];
          console.log(values);
          connection.query(query, vals, function(err, res, fields) {
            if (err) throw err;
            console.log('\nEmployee added');
          });
          viewAllEmp();
        })
      })
  })
  displayMainMenu();
}

/*
const updateEmpRole = () => {
  console.log('update employee role');

  displayMainMenu();
} */

const mainMenu = [
  {
    type: 'list',
    message: '\nWhat would you like to do?',
    name: 'actionInput',
    choices: [
      'View All Employees',
      'View All Departments',
      'View All Roles',
      'Add Employee',
      'Add Department',
      'Add Role',
      'Update Employee Role',
      'Quit'
    ]
  }
];

const addDeptQuestions = [{
  type: 'input',
  message: '\nPlease enter department name:',
  name: 'deptName'
}];