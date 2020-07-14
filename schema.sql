DROP database cms;

CREATE DATABASE cms;
USE cms;

CREATE TABLE department(
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (30)
);

CREATE TABLE role(
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR (30),
    salary DECIMAL,
    department_id INTEGER
);

CREATE TABLE employee(
	id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR (30),
    last_name VARCHAR (30),
    role_id INTEGER,
    manager_id INTEGER
);

INSERT INTO department VALUES (1, "Web Dev");

INSERT INTO role VALUES (1, "Developer", 60000.00, 1);

INSERT INTO employee VALUES(1,"Shayanne", "Samarasinghe", 1, 1);
INSERT INTO employee VALUES(0,"Mick", "Johnson", 1, 1);
INSERT INTO employee VALUES(0,"Alex", "Mastro", 1, 1)


