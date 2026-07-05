const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(process.cwd(), 'data.db');
const db = new Database(dbPath);

console.log('Initializing database...');

// Create tables
db.exec(`
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

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
  );
`);

console.log('Tables created.');

// Check if admin already exists
const adminExists = db.prepare('SELECT id FROM admin_users LIMIT 1').get();

if (!adminExists) {
  // Hash password for admin@nextvacancy.com / password123
  const passwordHash = bcrypt.hashSync('password123', 10);
  
  db.prepare(`
    INSERT INTO admin_users (email, password_hash, full_name)
    VALUES (?, ?, ?)
  `).run('admin@nextvacancy.com', passwordHash, 'Admin User');
  
  console.log('Admin user created: admin@nextvacancy.com / password123');
}

// Clear existing sections (for reset)
db.prepare('DELETE FROM section_items').run();
db.prepare('DELETE FROM sections').run();

// Insert sample sections
const sections = [
  { title: 'Latest Jobs', color: 'bg-red-600', icon: '💼', order_index: 1 },
  { title: 'Admit Cards', color: 'bg-green-600', icon: '📋', order_index: 2 },
  { title: 'Results', color: 'bg-yellow-600', icon: '📊', order_index: 3 },
  { title: 'Online Forms', color: 'bg-purple-600', icon: '📝', order_index: 4 },
  { title: 'Scholarships', color: 'bg-blue-600', icon: '🎓', order_index: 5 },
];

const sectionItems = {
  'Latest Jobs': [
    { title: 'Railway RRB Group D 2024', link: '#' },
    { title: 'UPSC IAS 2024', link: '#' },
    { title: 'Bank of India Clerk', link: '#' },
    { title: 'SSC CGL 2024', link: '#' },
  ],
  'Admit Cards': [
    { title: 'RRB ALP Admit Card 2024', link: '#' },
    { title: 'UPSC NDA Admit Card', link: '#' },
    { title: 'SBI PO Admit Card', link: '#' },
    { title: 'IBPS Clerk Admit Card', link: '#' },
  ],
  'Results': [
    { title: 'Railway RRB Results 2024', link: '#' },
    { title: 'SSC CHSL Result 2024', link: '#' },
    { title: 'Bank PO Merit List', link: '#' },
    { title: 'UPSC Prelims Result', link: '#' },
  ],
  'Online Forms': [
    { title: 'UPSC IAS Online Form 2025', link: '#' },
    { title: 'Railway Recruitment Board Form', link: '#' },
    { title: 'SSC Staff Selection Form', link: '#' },
    { title: 'Bank Clerk Application Form', link: '#' },
  ],
  'Scholarships': [
    { title: 'National Scholarship Portal', link: '#' },
    { title: 'SC/ST Scholarship 2024', link: '#' },
    { title: 'OBC Merit Scholarship', link: '#' },
    { title: 'Minority Scholarship Scheme', link: '#' },
  ],
};

sections.forEach((section) => {
  const result = db.prepare(`
    INSERT INTO sections (title, color, icon, order_index, visible)
    VALUES (?, ?, ?, ?, 1)
  `).run(section.title, section.color, section.icon, section.order_index);

  const sectionId = result.lastInsertRowid;

  // Insert items for this section
  const items = sectionItems[section.title] || [];
  items.forEach((item, index) => {
    db.prepare(`
      INSERT INTO section_items (section_id, title, link, order_index, visible)
      VALUES (?, ?, ?, ?, 1)
    `).run(sectionId, item.title, item.link, index + 1);
  });
});

console.log('Sample sections and items created.');

// Insert sample job
const futureDate = new Date();
futureDate.setMonth(futureDate.getMonth() + 3);

db.prepare(`
  INSERT INTO jobs (position, department, salary, eligibility, requirements, application_deadline, location, description)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'Assistant Manager',
  'State Bank of India',
  '₹50,000 - ₹80,000 per month',
  'Bachelor&apos;s Degree in any discipline with minimum 50% marks',
  'Age: 20-30 years, Computer literacy, Good communication skills',
  futureDate.toISOString().split('T')[0],
  'Pan India',
  'Eligible candidates with relevant experience are encouraged to apply.'
);

console.log('Sample job created.');
console.log('Database initialized successfully!');
db.close();
