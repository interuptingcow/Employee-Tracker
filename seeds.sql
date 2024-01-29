INSERT INTO department (name)
VALUES ("C-Suite"), --1
       ("Accounting"), --2
       ("Human Resources"), --3
       ("Sales"), --4
       ("IT"), --5
       ("Customer Service"), --6
       ("Marketing"), --7
       ("Finance"), --8
       ("Legal"), --9
       ("Engineering"), --10
       ("Operations"), --11

INSERT INTO role (title, salary, department_id)
VALUES ("Chief Executive Officer", 250000, 1),-- 1
       ("Chief Human Resources Officer", 245000, 3),--2
       ("Chief Technology Officer", 245000, 5),--3
       ("Chief Financial Officer", 245000, 8),--4
       ("Chief Operations Officer", 245000, 11),--5
       ("Human Intranet Designer", 150000, 5),--6
       ("Senior Integration Engineer", 200000, 10),--7
       ("Corporate Solutions Representative", 125000, 6),--8
       ("Lead Usability Planner", 75000, 11),--9
       ("Senior Brand Planner", 85000, 7),--10
       ("Senior Bookkeeper", 150000, 2),--11
       ("Talent Acquisition Specialist", 60000, 3),--12
       ("Business systems analyst", 150000, 5),--13
       ("Compliance Officer", 120000, 9),--14
       ("Sales Associate", 55000, 4);--15

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Max", "Hayes", 1, NULL),
       ("Lance", "Lane",4,1),
       ("Ben", "Gould",12,6),
       ("Elijah", "Warner",3,1),
       ("Chloe", "Stewart",2,1),
       ("Isla", "Cantrell",5,1),
       ("Ashtyn", "Bridges",11,5),
       ("Heidi", "Mendoza",13,4),
       ("Billy", "Gibson",6,4),
       ("Branden", "Olsen",7,4),
       ("Joseph", "Moore",14,1),
       ("Ayden", "Wallace",9,8),
       ("Jack", "Simpson",10,1),
       ("Lucille", "Kirby",15,1),
       ("Lexie", "Wells",8,6),
