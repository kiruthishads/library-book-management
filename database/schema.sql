-- Library Book Management System : database setup
-- Run this ONCE in MySQL (MySQL Workbench or: mysql -u root -p < database/schema.sql)
-- It only creates the empty database. Tables are created automatically by
-- Hibernate (spring.jpa.hibernate.ddl-auto=update) when the backend starts.

CREATE DATABASE IF NOT EXISTS library_book_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Optional: use a dedicated user instead of root (change the password!)
-- CREATE USER IF NOT EXISTS 'tt_user'@'localhost' IDENTIFIED BY 'ChangeMe#123';
-- GRANT ALL PRIVILEGES ON library_book_management.* TO 'tt_user'@'localhost';
-- FLUSH PRIVILEGES;
