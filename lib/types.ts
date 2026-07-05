// Type definitions for Next Vacancy

export interface Job {
  id: number;
  position: string;
  department: string;
  salary: string;
  eligibility: string;
  requirements: string;
  application_deadline: string;
  location: string;
  cutoff_marks?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  created_at: string;
  last_login?: string;
}

export interface Section {
  id: number;
  title: string;
  color: string;
  icon: string;
  order_index: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface SectionItem {
  id: number;
  section_id: number;
  title: string;
  link: string;
  order_index: number;
  visible: boolean;
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
