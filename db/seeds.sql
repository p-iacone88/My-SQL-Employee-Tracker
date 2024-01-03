INSERT INTO department (department_name)
VALUES ('Recording Studio'),
       ('Mixing Studio'),
       ('Mastering Studio'),
       ('Equipment'),
       ('Marketing'),
       ('Maintenance')

INSERT INTO role (job_title, salary, department_id)
VALUES ('Head Recording Engineer', 50000, 1),
       ('Assistant Recording Engineer', 40000, 1),
       ('Intern Recording Engineer', 25000, 1),
       ('Head Mixing Engineer', 55000, 2),       
       ('Assistant Mixing Engineer', 45000, 2),  
       ('Head Mastering Engineer', 60000, 3),  
       ('Assistant Mastering Engineer', 55000, 3),  
       ('Equipment Maintenance Manager', 45000, 4),  
       ('Equipment Maintenance Tech', 38000, 4),  
       ('Studio Rental Manager', 55000, 5),   
       ('Salesperson', 50000, 5),  
       ('Janitor', 38000, 6),  

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Brian', 'Wilson', 1, NULL),
       ('Dennis', 'Wilson', 2, 4),
       ('Carl', 'Wilson', 3, 7),
       ('Mike', 'Love', 4, 1),
       ('Alan', 'Jardine', 5, 4),
       ('Bruce', 'Johnston', 6, 7),
       ('David', 'Marks', 7, 6),
       ('Blondie', 'Chaplin', 8, 6),
       ('Ricky', 'Fataar', 9, NULL)
