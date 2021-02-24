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
  displayMain();
})

const displayMain = () => {
  inquirer.prompt(mainMenu).then(res => {
    switch (res.actionInput) {
      case "View All Departments":
        viewAllDept();
        break;
      case "View All Roles":
        viewAllRoles();
        break;
      case "View All Employees":
        viewAllEmp();
        break;
      case "Add Role":
        addRole();
        break;
      case "Add Employee":
        addEmp();
        break;
      case "Add Department":
        addDept();
        break;
      case "Update Employee Role":
        updateEmpRole();
        break;
      case "Quit":
        connection.end();
        break;
      }
  }).catch(err => {
    if(err) throw err;
  });
}

// view all employees
function viewAllEmp() {
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    if (res.length === 0) {
      console.log('\nThere are no employees added yet.\n');
      displayMain();
    } else {
      console.log('\nEmployees retrieved from database\n');
      console.table(res);
      displayMain();
    }
  });
}
// view all departments
function viewAllDept() {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    if (res.length === 0) {
      console.log('\nThere are no departments added yet.\n');
      displayMain();
    } else {
      console.log('\nDepartments retrieved from database\n');
      console.table(res);
      displayMain();
    }
  });

}
// view all roles
function viewAllRoles() {
  connection.query('SELECT * FROM role', function(err, res) {
    if (err) throw err;
    if (res.length === 0) {
      console.log('\nNo Roles have been added yet.\n');
      displayMain();
    } else {
      console.log('\nRoles retrieved from database\n');
      console.table(res);
      displayMain();
    }
  });
}

// add to department table
function addDept() {
  inquirer
  .prompt([
    {
      type: 'input',
      message: '\nPlease enter department name:',
      name: 'deptName'
    }
  ])
  .then(answer => {
    connection.query(
      'INSERT INTO department SET ?', {
        name: answer.deptName
      }, (err, res) => {
        if (err) throw err;
        console.log('\nDepartment added\n');
        displayMain();
    });
  });
  
}

// add to role table
function addRole() {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    // storing departments in array for choice list in inquirer
    const depts = res.map(({ id, name }) => ({
      value: id,
      name: `${id} ${name}`
    }));
    console.table(res);
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
      message: "\nSelect department this role falls under:",
      choices: depts,
      name: 'roleDept'
      }
    ]).then(answers => {
      connection.query('INSERT INTO role SET ?', {
        title: answers.roleName,
        salary: answers.salary,
        department_id: answers.roleDept
      }, (err, res) => {
        if (err) throw err;
        console.log('Role added to database');
        displayMain();
      });
    });
  })
}

// add to employee table
const addEmp = () => {
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;

    const roles = res.map(({ id, title, salary }) => ({
      value: id,
      title: `${title}`,
      salary: `${salary}`

    }));
    console.table(res);

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
        choices: roles
        }
      ]).then(answers => {
        connection.query('INSERT INTO employee SET ?', {
          first_name: answers.firstName,
          last_name: answers.lastName,
          role_id: answers.empRole
        }, (err, res) => {
          if (err) throw err;
          console.log('Employee added!');
          displayMain();
        });
         
      });
  })
  
}

/*
const updateEmpRole = () => {
  console.log('update employee role');

  displayMain();
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