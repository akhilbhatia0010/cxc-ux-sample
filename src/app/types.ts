import type { ReactNode } from "react";

export type UserRole =
  | "cxc-admin"
  | "school-admin"
  | "local-registrar"
  | "teacher"
  | "private-candidate";

export type CurrentUser = {
  name: string;
  email: string;
  role: UserRole;
  territory?: string;
  avatarInitials: string;
};

export type ModuleKey =
  | "dashboard"
  | "subject-management"
  | "scoring"
  | "grading"
  | "reporting"
  | "teacher-portal"
  | "billing"
  | "admin-console"
  | "registrar"
  | "centre-management"
  | "pattern-library"
  | "self-registration"
  | "emis"
  | "hei"
  | "payment-gateway"
  | "migration";

export type SubjectComponent = {
  id: string;
  name: string;
  weighting: number;
  carryForward: boolean;
  changed: boolean;
};

export type UploadStage = {
  key: string;
  label: string;
  uploaded: boolean;
  rows: number;
  warnings: number;
  errors: number;
};

export type CandidateScore = {
  ucn: string;
  name: string;
  attendance: "Present" | "Absent";
  mc: number | null;
  qp: number | null;
  sba: number | null;
  moderation: number | null;
};

export type TeacherStudent = {
  id: string;
  name: string;
  ucn: string;
  project: number;
  lab: number;
  test: number;
  portfolioUploaded: boolean;
  carryForwardEligible: boolean;
};

export type Invoice = {
  id: string;
  entity: string;
  territory: string;
  amount: number;
  paid: number;
  hold: boolean;
  status: "Pending" | "Partial" | "Paid" | "Overdue";
};

export type RegistrarCandidate = {
  id: string;
  name: string;
  ucn: string;
  subjects: string[];
  idUploaded: boolean;
  ageCheck: "Pass" | "Flag";
  status: "Pending" | "Approved" | "Rejected" | "Info Requested";
  notes: string;
};

export type NavItem = {
  key: ModuleKey;
  label: string;
  icon: ReactNode;
  screens: string[];
  flagged?: boolean;
};
