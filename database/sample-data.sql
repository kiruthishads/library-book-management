-- Library Book Management System : OPTIONAL sample data
-- Run AFTER the backend has started once (so Hibernate has created the tables).
USE library_book_management;

INSERT INTO books (book_id, title, author, category, status) VALUES
('B101', 'Core Java', 'Cay Horstmann', 'Programming', 'AVAILABLE'),
('B102', 'Clean Code', 'Robert C. Martin', 'Software Engineering', 'ISSUED'),
('B103', 'Database System Concepts', 'Silberschatz', 'Databases', 'AVAILABLE');
