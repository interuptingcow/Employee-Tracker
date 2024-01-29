const inquirer = require('inquirer');

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'glover12',
        database: 'courses_db'
    },
    console.log(`Connected to the courses_db database.`)
);
const runProgram = function () {
    inquirer
        .prompt([])
        .then((answers) => { })
}
// QUERIES
//view all departments, 
db.query(`SELECT name FROM departments`, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
    runProgram;
})

//view all roles, 
db.query(`SELECT title FROM role`, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
    runProgram;
})
// view all employees, 
db.query(`SELECT first_name, last_name FROM employee`, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
    runProgram;
})
//add a department, 
db.query(`INSERT INTO department (name) VALUES (${})`, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
    runProgram;
})
//add a role, 
db.query(`INSERT INTO role (title, salary, department_id) VALUES (${})`, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
    runProgram;
})
//add an employee, 
db.query(`INSERT INTO employee (first_name, Last_name, role_id, manager_id) VALUES (${})`, , (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
    runProgram;
})
//update an employee role
db.query(`UPDATE employee SET role = ${}`, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
    runProgram;
})
//Update employee managers.
db.query(`UPDATE employee SET manager_id = ${}`, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
    runProgram;
});
//View employees by manager.
db.query(`SELECT * FROM employee ORDER BY manager_id`, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
    runProgram;
});
//View employees by department.
db.query(`SELECT employee.first_name, employee.last_name, department.name
          FROM department
          INNER JOIN role ON role.department_id = department.id
          INNER JOIN employee ON employee.role_id = role.id;`, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
    runProgram;
});

//Delete departments
db.query(`DELETE FROM departments WHERE id = ?`, ${}, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
    runProgram;
});
//Delete  roles,
db.query(`DELETE FROM role WHERE id = ?`, ${}, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
    runProgram;
});
//Delete employees
db.query(`DELETE FROM employee WHERE id = ?`, ${}, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
    runProgram;
});
//View the total utilized budget of a department
db.query(`SELECT role.salary AS Budget, department.name
          FROM role
          JOIN department ON role.department_id = department.id`, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
    runProgram;
});