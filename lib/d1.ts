// Cloudflare D1 database client wrapper
// Supports both Cloudflare D1 in production/development and better-sqlite3 for standard local dev
import { getCloudflareContext } from '@opennextjs/cloudflare';

export interface DbClient {
  prepare(sql: string): {
    all<T = any>(...params: any[]): Promise<T[]>;
    get<T = any>(...params: any[]): Promise<T | null>;
    run(...params: any[]): Promise<{ lastInsertRowid: number | string; changes: number }>;
  };
  exec(sql: string): Promise<void>;
}

let localDb: any = null;

function getLocalDatabase(): any {
  if (!localDb) {
    const fs = require('fs');
    const path = require('path');
    const parts = ['better', 'sqlite3'];
    const Database = require(parts.join('-'));

    const dbDir = path.join(process.cwd(), '.data');
    const dbPath = path.join(dbDir, 'jobs-portal.db');
    
    // Create .data directory if it doesn't exist
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    localDb = new Database(dbPath);
    localDb.pragma('journal_mode = WAL');
    
    // Initialize tables in local database
    const { JOBS_TABLE_SCHEMA, ADMIN_USERS_TABLE_SCHEMA, SECTIONS_TABLE_SCHEMA, SECTION_ITEMS_TABLE_SCHEMA } = require('./db-schema');
    localDb.exec(JOBS_TABLE_SCHEMA);
    localDb.exec(SECTIONS_TABLE_SCHEMA);
    localDb.exec(SECTION_ITEMS_TABLE_SCHEMA);
    localDb.exec(ADMIN_USERS_TABLE_SCHEMA);
  }
  return localDb;
}

export function getDatabase(): DbClient {
  let d1Db: any = null;
  try {
    const context = getCloudflareContext();
    if (context && context.env && context.env.DB) {
      d1Db = context.env.DB;
    }
  } catch (e) {
    // Not in Cloudflare environment
  }

  if (d1Db) {
    return {
      prepare(sql: string) {
        const stmt = d1Db.prepare(sql);
        return {
          all: async (...params: any[]) => {
            const res = await stmt.bind(...params).all();
            return res.results || [];
          },
          get: async (...params: any[]) => {
            return await stmt.bind(...params).first();
          },
          run: async (...params: any[]) => {
            const res = await stmt.bind(...params).run();
            return {
              lastInsertRowid: res.meta?.last_row_id ?? 0,
              changes: res.meta?.changes ?? 0
            };
          }
        };
      },
      async exec(sql: string) {
        await d1Db.exec(sql);
      }
    };
  } else {
    const db = getLocalDatabase();
    return {
      prepare(sql: string) {
        const stmt = db.prepare(sql);
        return {
          all: async (...params: any[]) => stmt.all(...params),
          get: async (...params: any[]) => stmt.get(...params) || null,
          run: async (...params: any[]) => {
            const res = stmt.run(...params);
            return {
              lastInsertRowid: res.lastInsertRowid,
              changes: res.changes
            };
          }
        };
      },
      async exec(sql: string) {
        db.exec(sql);
      }
    };
  }
}

// Job queries
export async function getAllJobs(search?: string, filter?: Record<string, string>) {
  const db = getDatabase();
  let query = 'SELECT * FROM jobs WHERE 1=1';
  const params: any[] = [];

  if (search) {
    query += ' AND (position LIKE ? OR department LIKE ? OR location LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (filter?.department) {
    query += ' AND department = ?';
    params.push(filter.department);
  }

  if (filter?.location) {
    query += ' AND location = ?';
    params.push(filter.location);
  }

  query += ' ORDER BY created_at DESC';

  const stmt = db.prepare(query);
  return stmt.all(...params);
}

export async function getJobById(id: number) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM jobs WHERE id = ?');
  return stmt.get(id);
}

export async function createJob(job: {
  position: string;
  department: string;
  salary: string;
  eligibility: string;
  requirements: string;
  application_deadline: string;
  location: string;
  cutoff_marks?: string;
  description?: string;
}) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO jobs (position, department, salary, eligibility, requirements, application_deadline, location, cutoff_marks, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = await stmt.run(
    job.position,
    job.department,
    job.salary,
    job.eligibility,
    job.requirements,
    job.application_deadline,
    job.location,
    job.cutoff_marks || null,
    job.description || null
  );

  return result;
}

export async function updateJob(id: number, job: Partial<any>) {
  const db = getDatabase();
  const updates: string[] = [];
  const values: any[] = [];

  Object.entries(job).forEach(([key, value]) => {
    if (key !== 'id') {
      updates.push(`${key} = ?`);
      values.push(value);
    }
  });

  values.push(id);
  updates.push('updated_at = CURRENT_TIMESTAMP');

  const query = `UPDATE jobs SET ${updates.join(', ')} WHERE id = ?`;
  const stmt = db.prepare(query);
  return stmt.run(...values);
}

export async function deleteJob(id: number) {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM jobs WHERE id = ?');
  return stmt.run(id);
}

// Admin user queries
export async function getAdminByEmail(email: string) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM admin_users WHERE email = ?');
  return stmt.get(email);
}

export async function updateAdminLastLogin(id: number) {
  const db = getDatabase();
  const stmt = db.prepare('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?');
  return stmt.run(id);
}
