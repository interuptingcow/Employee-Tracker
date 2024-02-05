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

let roleId;
let deptId;
let eeId;
let managerId;

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

const getEmployeeChoices = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT first_name, last_name FROM employee', (err, results) => {
            if (err) {
                console.error('Error fetching employee names: ', err);
                reject(err);
            } else {
                const employeeNames = results.map((employee) => `${employee.first_name} ${employee.last_name}`);
                resolve(employeeNames);
            }
        });
    });
};

const queryAsync = (sql) => {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Database query error: ', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

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
                    return updateEmployeeRole();
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
        console.table(result);
        runProgram();
    });
};

//view all roles, 
const viewAllRoles = () => {
    db.query(`SELECT title FROM role`, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.table(result);
        runProgram();
    });
};

// view all employees, 
const viewAllEmployees = () => {
    db.query(`SELECT first_name, last_name FROM employee`, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.table(result);
        runProgram();
    });
}

//add a department, 
const addDepartment = () => {

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'deptName',
                message: "What is the name of the department?",
            },

        ])

        .then((answers) => {
            db.query(`INSERT INTO department (name) VALUES ('${answers.deptName}')`, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log("Department added successfully");
                runProgram();
            });
        })
};

//add a role, 
const addRole = () => {

    getDepartmentChoices();

    const getUserInfo = async () => {
        try {
            const departmentChoices = await getDepartmentChoices();


            const userInfo = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: "What is the name of the new role?",
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: "What is the new role's salary?",
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'What department is the new role in?',
                    choices: departmentChoices,
                },
            ]);

            const deptIdResult = await queryAsync(`SELECT id FROM department WHERE name='${userInfo.department}'`)
            deptId = deptIdResult[0].id;

            db.query(`INSERT INTO role (title, salary, department_id) 
                  VALUES ('${userInfo.title}', '${userInfo.salary}', '${deptId}')`, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log("Role added successfully");
                runProgram();
            });
        } catch (error) {
            console.error('An error occurred: ', error);
            runProgram();
        }

    }
    getUserInfo();
};

//add an employee, 
const addEmployee = () => {

    getDepartmentChoices();
    getRoleChoices();
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

            const roleIdResult = await queryAsync(`SELECT id FROM role WHERE title='${userInfo.role}'`)
            roleId = roleIdResult[0].id;

            const deptIdResult = await queryAsync(`SELECT id FROM department WHERE name='${userInfo.department}'`)
            deptId = deptIdResult[0].id;

            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                  VALUES ('${userInfo.firstName}', '${userInfo.lastName}', '${roleId}', '${deptId}')`, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log("Employee added successfully");
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
const updateEmployeeRole = () => {

    getRoleChoices();
    getEmployeeChoices();

    const getUserInfo = async () => {
        try {
            const employeeChoices = await getEmployeeChoices();
            const roleChoices = await getRoleChoices();

            const userInfo = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeName',
                    message: "Choose employee to update role.",
                    choices: employeeChoices,
                },
                {
                    type: 'list',
                    name: 'newRole',
                    message: 'Please choose their new role.',
                    choices: roleChoices,
                },

            ]);

            const roleIdResult = await queryAsync(`SELECT id FROM role WHERE title='${userInfo.newRole}'`)
            roleId = roleIdResult[0].id;

            const eeIdResult = await queryAsync(`SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name)='${userInfo.employeeName}'`);
            eeId = eeIdResult[0].id;

            db.query(`UPDATE employee SET role_id = '${roleId}' WHERE id = '${eeId}'`, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log("Employee role updated successfully");
                runProgram();
            });
        } catch (error) {
            console.error('An error occurred: ', error);
            runProgram();
        };
    };
    getUserInfo();
}

//Update employee managers.
const updateEmployeeManager = () => {
    getEmployeeChoices();

    const getUserInfo = async () => {
        try {
            const employeeChoices = await getEmployeeChoices();

            const userInfo = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeName',
                    message: "Choose employee to update manager.",
                    choices: employeeChoices,
                },
                {
                    type: 'list',
                    name: 'newManager',
                    message: 'Please choose their new manager.',
                    choices: employeeChoices,
                },

            ]);

            const eeIdResult = await queryAsync(`SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name)='${userInfo.employeeName}'`);
            eeId = eeIdResult[0].id;

            const managerIdResult = await queryAsync(`SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name)='${userInfo.newManager}'`);
            managerId = managerIdResult[0].id;

            db.query(`UPDATE employee SET manager_id = '${managerId}' WHERE id = '${eeId}'`, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log("Employee manager updated successfully");
                runProgram();
            });
        } catch (error) {
            console.error('An error occurred: ', error);
            runProgram();
        };
    };
    getUserInfo();
};

//View employees by manager.
const viewEmployeesByManager = () => {
    db.query(`SELECT * FROM employee ORDER BY manager_id`, (err, result) => {
        if (err) {
            console.log(err);
        }
        console.table(result);
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
        console.table(result);
        runProgram();
    });
};

//Delete department
const deleteDepartment = () => {

    getDepartmentChoices();

    const getUserInfo = async () => {
        try {
            const departmentChoices = await getDepartmentChoices();


            const userInfo = await inquirer.prompt([

                {
                    type: 'list',
                    name: 'department',
                    message: 'What department would you like to delete?',
                    choices: departmentChoices,
                },
                {
                    type: "confirm",
                    name: "confirm",
                    message: "Are you sure you want to delete this department?",
                },
            ]);

            if (!userInfo.confirm) {
                console.log("Process aborted");
                runProgram();
            } else {
                const deptIdResult = await queryAsync(`SELECT id FROM department WHERE name='${userInfo.department}'`)
                deptId = deptIdResult[0].id;

                db.query(`DELETE FROM department WHERE id = '${deptId}'`, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("Department deleted successfully");
                    runProgram();
                });
            }
        } catch (error) {
            console.error('An error occurred: ', error);
            runProgram();
        }
    };
    getUserInfo()
};

//Delete  role,
const deleteRole = () => {
    getRoleChoices();

    const getUserInfo = async () => {
        try {
            const roleChoices = await getRoleChoices();


            const userInfo = await inquirer.prompt([

                {
                    type: 'list',
                    name: 'role',
                    message: 'What role would you like to delete?',
                    choices: roleChoices,
                },
                {
                    type: "confirm",
                    name: "confirm",
                    message: "Are you sure you want to delete this role?",
                },
            ]);

            if (!userInfo.confirm) {
                console.log("Process aborted");
                runProgram();
            } else {
                const roleIdResult = await queryAsync(`SELECT id FROM role WHERE title='${userInfo.role}'`)
                roleId = roleIdResult[0].id;

                db.query(`DELETE FROM role WHERE id = '${roleId}'`, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("Role deleted successfully");
                    runProgram();
                });
            }
        } catch (error) {
            console.error('An error occurred: ', error);
            runProgram();
        }
    };
    getUserInfo()
};

//Delete employees
const deleteEmployee = () => {
    getEmployeeChoices();

    const getUserInfo = async () => {
        try {
            const employeeChoices = await getEmployeeChoices();


            const userInfo = await inquirer.prompt([

                {
                    type: 'list',
                    name: 'employee',
                    message: 'What employee would you like to delete?',
                    choices: employeeChoices,
                },
                {
                    type: "confirm",
                    name: "confirm",
                    message: "Are you sure you want to delete this employee?",
                },
            ]);

            if (!userInfo.confirm) {
                console.log("Process aborted");
                runProgram();
            } else {
                const eeIdResult = await queryAsync(`SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name)='${userInfo.employee}'`);
                eeId = eeIdResult[0].id;

                db.query(`DELETE FROM employee WHERE id = '${eeId}'`, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("Employee deleted successfully");
                    runProgram();
                });
            }
        } catch (error) {
            console.error('An error occurred: ', error);
            runProgram();
        }
    };
    getUserInfo()
};

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
        console.table(result);
        runProgram();
    });
};

const exit = () => {
    console.log('Goodbye');
    process.exit(0);
};

runProgram();