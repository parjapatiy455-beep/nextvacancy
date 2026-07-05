// Database schema for Next Vacancy
// Tables: jobs, sections, admin_users

export const JOBS_TABLE_SCHEMA = `
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  salary TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  requirements TEXT NOT NULL,
  application_deadline TEXT NOT NULL,
  location TEXT NOT NULL,
  cutoff_marks TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

export const SECTIONS_TABLE_SCHEMA = `
CREATE TABLE IF NOT EXISTS sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  visible BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

export const SECTION_ITEMS_TABLE_SCHEMA = `
CREATE TABLE IF NOT EXISTS section_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  visible BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);
`;

export const ADMIN_USERS_TABLE_SCHEMA = `
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);
`;

export const SEED_ADMIN_DATA = `
INSERT INTO admin_users (email, password_hash, full_name) VALUES
('admin@nextvacancy.com', '$2a$10$aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890abcdefghijklmnop', 'Admin User');
`;

export const SEED_SECTIONS_DATA = `
INSERT INTO sections (title, color, icon, order_index, visible) VALUES
('Latest Jobs', 'bg-red-600', '💼', 1, 1),
('Admit Cards', 'bg-green-600', '📋', 2, 1),
('Results', 'bg-yellow-600', '📊', 3, 1),
('Online Forms', 'bg-purple-600', '📝', 4, 1),
('Scholarships', 'bg-blue-600', '🎓', 5, 1);
`;
