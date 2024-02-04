import inquirer from 'inquirer';
import mysql from 'mysql2';

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'glover12',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
);


const runProgram = function () {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: [
                    'View All Departments',
                    'View All Roles',
                    'View All Employees',
                    'Add a Department',
                    'Add a Role',
                    'Add an Employee',
                    'Update an Employee Role',
                    'Update Employee Manager',
                    'View Employees by Manager',
                    'View Employees by Department',
                    'Delete Department',
                    'Delete Role',
                    'Delete Employee',
                    'View Total Utilized Budget by Department',
                    'Exit'
                ]
            }
        ])
        .then(({ choice }) => {
            switch (choice) {
                case 'View All Departments':
                    return viewAllDepartments();
                case 'View All Roles':
                    return viewAllRoles();
                case 'View All Employees':
                    return viewAllEmployees();
                case 'Add a Department':
                    return addDepartment();
                case 'Add a Role':
                    return addRole();
                case 'Add an Employee':
                    return addEmployee();
                case 'Update an Employee Role':
                    return updateEmployee();
                case 'Update Employee Manager':
                    return updateEmployeeManager();
                case 'View Employees by Manager':
                    return viewEmployeesByManager();
                case 'View Employees by Department':
                    return viewEmployeesByDepartment();
                case 'Delete Department':
                    return deleteDepartment();
                case 'Delete Role':
                    return deleteRole();
                case 'Delete Employee':
                    return deleteEmployee();
                case 'View Total Utilized Budget by Department':
                    return totalUtilBudgByDept();
                case 'Exit':
                    return exit();

            }
        })
}


// QUERIES
//view all departments, 
const viewAllDepartments = () => {
    db.query(`SELECT name FROM department`, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
        runProgram();
    });
};

//view all roles, 
const viewAllRoles = () => {
    db.query(`SELECT title FROM role`, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
        runProgram();
    });
};

// view all employees, 
const viewAllEmployees = () => {
    db.query(`SELECT first_name, last_name FROM employee`, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
        runProgram();
    });
}

//add a department, 
// const addDepartment = () => {

//     inquirer
//         .prompt([
//             {
//                 type: 'input',
//                 name: 'firstName',
//                 message: "What is the name of the department?",
//             },
//             {
//                 type: 'input',
//                 name: 'manager',
//                 message: 'Who manages this department?',
//                 choices:
//             }
//         ])
//     db.query(`INSERT INTO department (name) VALUES (${})`, (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         console.log(result);
//         runProgram();
//     });
// };

//add a role, 
// const addRole = () => {
//     db.query(`INSERT INTO role (title, salary, department_id) VALUES (${})`, (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         console.log(result);
//         runProgram();
//     });
// };

//add an employee, 
const addEmployee = () => {
    let roleId;
    let deptId;
    const getDepartmentChoices = () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT name FROM department', (err, results) => {
                if (err) {
                    console.error('Error fetching department names: ', err);
                    reject(err);
                } else {
                    const departmentNames = results.map((department) => department.name);
                    resolve(departmentNames);
                }
            });
        });
    };
    const getRoleChoices = () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT title FROM role', (err, results) => {
                if (err) {
                    console.error('Error fetching department names: ', err);
                    reject(err);
                } else {
                    const roleNames = results.map((role) => role.title);
                    resolve(roleNames);
                }
            });
        });
    };
    const getUserInfo = async () => {
        try {
            const departmentChoices = await getDepartmentChoices();
            const roleChoices = await getRoleChoices();
    
            const userInfo = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?",
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?",
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is their role?',
                choices: roleChoices,
            },
            {
                type: 'list',
                name: 'department',
                message: 'What department are they in?',
                choices: departmentChoices,
            },
        ]);
        db.query(`SELECT id FROM role WHERE title='${userInfo.role}'`, (err, results) => {
            if (err) {
                console.log(err);
            }
            roleId = result;
            return roleId
        });
        db.query(`SELECT id FROM department WHERE name='${userInfo.department}'`, (err, results) => {
            if (err) {
                console.log(err);
            }
            deptId = result;
            return deptId
        })
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                  VALUES ('${userInfo.firstName}', '${userInfo.lastName}', '${roleId}', '${deptId}')`, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log(result);
            runProgram();
        });
    } catch (error) {
        console.error('An error occurred: ', error);
        runProgram();
    }
        
}
getUserInfo();
};

//update an employee role
// const updateEmployee = () => {
//     db.query(`UPDATE employee SET role = ${}`, (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         console.log(result);
//         runProgram();
//     });
// };

//Update employee managers.
// const updateEmployeeManager = () => {
//     db.query(`UPDATE employee SET manager_id = ${}`, (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         console.log(result);
//         runProgram();
//     });
// };

//View employees by manager.
const viewEmployeesByManager = () => {
    db.query(`SELECT * FROM employee ORDER BY manager_id`, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
        runProgram();
    });
};

//View employees by department.
const viewEmployeesByDepartment = () => {
    db.query(`SELECT company_db.employee.first_name, company_db.employee.last_name, company_db.department.name AS Department
          FROM company_db.department
          INNER JOIN company_db.role ON company_db.role.department_id = company_db.department.id
          INNER JOIN company_db.employee ON company_db.employee.role_id = company_db.role.id;`, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result)();
        runProgram;
    });
};

//Delete department
// const deleteDepartment = () => {
//     db.query(`DELETE FROM department WHERE id = ?`, ${}, (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         console.log(result);
//         runProgram();
//     });
// };

//Delete  role,
// const deleteRole = () => {
//     db.query(`DELETE FROM role WHERE id = ?`, ${}, (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         console.log(result);
//         runProgram();
//     });
// };

//Delete employees
// const deleteEmployee = () => {
//     db.query(`DELETE FROM employee WHERE id = ?`, ${}, (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         console.log(result);
//         runProgram();
//     });
// };

//View the total utilized budget of a department
const totalUtilBudgByDept = () => {
    db.query(`SELECT company_db.department.name AS Department,
          SUM(company_db.role.salary) AS TotalBudget
          FROM company_db.department
          INNER JOIN company_db.role ON company_db.department.id = company_db.role.department_id
          GROUP BY company_db.department.name;`, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
        runProgram();
    });
};

const exit = () => {
    console.log('Goodbye');
    process.exit(0);
};

runProgram();