-- Seed data for Next Vacancy

-- Delete existing admin user if exists to avoid unique constraint error
DELETE FROM admin_users WHERE email = 'admin@nextvacancy.com';

-- Insert admin user (password: password123)
INSERT INTO admin_users (email, password_hash, full_name)
VALUES ('admin@nextvacancy.com', 'c3ce0be86bf0046958de4cc20ae7a085:bd68b5a47741b16e6eafb6740d61f082092aadc6d35e60e87bd9f7a8f1212b7f', 'Admin User');

-- Seed default sections (only if empty)
INSERT INTO sections (title, color, icon, order_index, visible)
SELECT 'Latest Jobs', 'bg-red-600', '💼', 1, 1 WHERE NOT EXISTS (SELECT 1 FROM sections WHERE title = 'Latest Jobs');

INSERT INTO sections (title, color, icon, order_index, visible)
SELECT 'Admit Cards', 'bg-green-600', '📋', 2, 1 WHERE NOT EXISTS (SELECT 1 FROM sections WHERE title = 'Admit Cards');

INSERT INTO sections (title, color, icon, order_index, visible)
SELECT 'Results', 'bg-yellow-600', '📊', 3, 1 WHERE NOT EXISTS (SELECT 1 FROM sections WHERE title = 'Results');

INSERT INTO sections (title, color, icon, order_index, visible)
SELECT 'Online Forms', 'bg-purple-600', '📝', 4, 1 WHERE NOT EXISTS (SELECT 1 FROM sections WHERE title = 'Online Forms');

INSERT INTO sections (title, color, icon, order_index, visible)
SELECT 'Scholarships', 'bg-blue-600', '🎓', 5, 1 WHERE NOT EXISTS (SELECT 1 FROM sections WHERE title = 'Scholarships');
