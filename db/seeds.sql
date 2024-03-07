
-- Insert departments
INSERT INTO department (name) VALUES
('HR'),
('Finance'),
('IT');

-- Insert roles
INSERT INTO role (title, salary, department_id) VALUES
('HR Manager', 70000, 1),
('HR Assistant', 50000, 1),
('Finance Manager', 80000, 2),
('Financial Analyst', 60000, 2),
('IT Manager', 90000, 3),
('Software Developer', 75000, 3);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL), -- HR Manager
('Jane', 'Smith', 2, 1),   -- HR Assistant (Managed by John Doe)
('Michael', 'Johnson', 3, NULL), -- Finance Manager
('Emily', 'Williams', 4, 3),     -- Financial Analyst (Managed by Michael Johnson)
('David', 'Brown', 5, NULL), -- IT Manager
('Sarah', 'Taylor', 6, 5);     -- Software Developer (Managed by David Brown)
