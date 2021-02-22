const inquirer = require('inquirer');
const mysql = require('mysql');
const consoleTable = require('console.table');

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
  mainMenu();
})

const mainMenu = () => {
  inquirer.prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'actionInput',
      choices: [
        'View All Employees',
        'View All Departments',
        'View All Roles',
        'Add Employee',
        'Add Department',
        'Add Role',
        'Update Employee Role'
      ]
    }
  ]).then((answer) => {
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
    }

  })
}

const viewAllEmp = () => {
  console.log('view all employees');

  mainMenu();
}

const viewAllDept = () => {
  console.log('view all departments');


  mainMenu();
}

const viewAllRoles = () => {
  console.log('view all roles');


  mainMenu();
}

const addEmp = () => {
  console.log('add employee');
  /*
  inquirer
  .prompt(addEmpQuestions)
  .then(answers => {
    connection.query(
      'INSERT INTO employee SET ?', {
        first_name: answers.firstName,
        last_name: answers.lastName,
        role_id: null,
        manager_id: null
      }, (err, res) => {
        if (err) throw err;
      }
    );
  }); */

  mainMenu();
}

const addDept = () => {
  console.log('add department');
  inquirer
  .prompt(addDeptQuestions)
  .then(answer => {
    connection.query(
      'INSERT INTO department SET ?', {
        name: answer.deptName
      }, (err, res) => {
        if (err) throw err;
      }
    );
  });
  mainMenu();
}

const addRole = () => {
  console.log('add role');

  mainMenu();
}

const updateEmpRole = () => {
  console.log('update employee role');

  mainMenu();
}

const addDeptQuestions = [{
  type: 'input',
  message: 'Please enter department name:',
  name: 'deptName'
}];

const addEmpQuestions = [{
    type: 'input',
    message: "Please enter employee's first name:",
    name: 'firstName'
  },
  {
    type: 'input',
    message: "Please enter employee's last name:",
    name: 'lastName'
  },
  {
    type: 'list',
    message: "Please enter employee's role:",
    choices: ['something', 'some other thing'],//roleChoices,
    name: 'empRole'
  }
];

const addRoleQuestions = [{
  type: 'input',
  message: "Please enter job title:",
  name: 'roleName'
},
{
  type: 'input',
  message: 'Please enter salary of role:',
  name: 'salary'
},
{
  type: 'input',
  message: "Please enter role's department ID: ",
  name: 'roleDept'
}
];


/*
const validateString = async input => {

}

const validateNumber = async input => {

} */
