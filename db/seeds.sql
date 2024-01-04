INSERT INTO department (department_name)
VALUES ('Recording Studio'),
       ('Mixing Studio'),
       ('Mastering Studio'),
       ('Equipment'),
       ('Marketing'),
       ('Maintenance');

INSERT INTO role (job_title, salary, department_id)
VALUES ('Head Recording Engineer', 75000, 1),
       ('Assistant Recording Engineer', 55000, 1),
       ('Intern Recording Engineer', 32000, 1),
       ('Head Mixing Engineer', 75000, 2),       
       ('Assistant Mixing Engineer', 55000, 2),  
       ('Head Mastering Engineer', 77000, 3),  
       ('Assistant Mastering Engineer', 55000, 3),  
       ('Equipment Maintenance Manager', 45000, 4),  
       ('Equipment Maintenance Tech', 38000, 4),  
       ('Studio Rental Manager', 55000, 5),   
       ('Salesperson', 50000, 5),  
       ('Janitor', 38000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Brian', 'Wilson', 1, NULL),
       ('Dennis', 'Wilson', 2, 1),
       ('Carl', 'Wilson', 3, 2),
       ('Mike', 'Love', 4, NULL),
       ('Alan', 'Jardine', 5, 4),
       ('Bruce', 'Johnston', 6, 2),
       ('David', 'Marks', 7, 6),
       ('Blondie', 'Chaplin', 8, 6),
       ('Ricky', 'Fataar', 9, NULL);
