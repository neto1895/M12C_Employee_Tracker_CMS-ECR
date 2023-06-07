INSERT INTO departments (department_name)
VALUES  ('Sales'),
        ('Engineering'),
        ('IT'),
        ('R&D'),
        ('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES  ('Salesman', '60000', 1),
        ('Engineer I', '100000', 2),
        ('Project Manager', '80000', 2),
        ('Product Manager','80000', 2),
        ('Lawyer','75000',5),
        ('Developer I','65000',4);

INSERT INTO employees (first_name,last_name, title_id, manager_id)
VALUES  ('Aime', 'Rangel',4, null),
        ('Snella', 'Von Parda', 1,null),
        ('Xixa','Calicq',6, null),
        ('Huantonio', 'C.R.', 2,1),
        ('Komilia', 'Flotante',3,2),
        ('Raja', 'Orange',5,3),
        ('Megan', 'Ghost',1,3),
        ('Miela', 'Cabrera',1,2),
        ('Jenny','Cow',2,1);