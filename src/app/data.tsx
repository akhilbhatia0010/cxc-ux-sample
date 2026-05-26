import {
  BarChart3,
  BookOpen,
  Building2,
  CreditCard,
  FileCog,
  FileSpreadsheet,
  FolderTree,
  GraduationCap,
  LayoutDashboard,
  MapPinned,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Upload,
  Users,
  Wallet,
} from "lucide-react";

import type {
  CandidateScore,
  CurrentUser,
  Invoice,
  ModuleKey,
  NavItem,
  RegistrarCandidate,
  SubjectComponent,
  TeacherStudent,
  UploadStage,
  UserRole,
} from "./types";

/** Set to true to reveal all modules in the sidebar (for internal demos). */
export const FEATURE_FLAGS = {
  showExtraModules: false,
};

export const navItems: NavItem[] = [
  { key: "dashboard",          label: "Dashboard",           icon: <LayoutDashboard className="size-4" />, screens: ["Overview", "Activity"],                                                                                               flagged: true  },
  { key: "subject-management", label: "Subject Management",  icon: <FolderTree className="size-4" />,      screens: ["Subject List", "Components & Weighting"]                                                                                          },
  { key: "scoring",            label: "Scoring Workspace",   icon: <Upload className="size-4" />,          screens: ["Pipeline", "Recalculation"]                                                                                                        },
  { key: "grading",            label: "Grading Workbench",   icon: <BarChart3 className="size-4" />,       screens: ["Trial Grading", "Grade Boundaries", "Grade Statistics", "Profile Grading", "Committee Review", "Hardship Queue"]                  },
  { key: "reporting",          label: "Reporting Framework", icon: <FileSpreadsheet className="size-4" />, screens: ["Library", "Builder", "PDF Preview"]                                                                                               },
  { key: "teacher-portal",     label: "Teacher Portal",      icon: <GraduationCap className="size-4" />,   screens: ["Desktop My Classes", "Desktop Score Entry", "Mobile Today", "Mobile Score Entry"],                                 flagged: true  },
  { key: "billing",            label: "Billing & Fees",      icon: <Wallet className="size-4" />,          screens: ["Finance Dashboard", "Invoice Detail", "Candidate Invoice"],                                                          flagged: true  },
  { key: "admin-console",      label: "Admin Console",       icon: <Settings2 className="size-4" />,       screens: ["Admin Dashboard", "Registration Periods", "User Management"],                                                       flagged: true  },
  { key: "registrar",          label: "Local Registrar",     icon: <ShieldCheck className="size-4" />,     screens: ["Approval Queue", "Candidate Review", "Ministry Dashboard"],                                                         flagged: true  },
  { key: "centre-management",  label: "Centre Management",   icon: <MapPinned className="size-4" />,       screens: ["Centre Directory", "Centre Detail", "Assignment Workspace", "Script Requirements"],                                 flagged: true  },
  { key: "pattern-library",    label: "Pattern Library",     icon: <BookOpen className="size-4" />,        screens: ["Colours", "Components"],                                                                                            flagged: true  },
  { key: "self-registration",  label: "Self Registration",   icon: <Users className="size-4" />,           screens: ["Welcome", "Desktop Subject Selection", "Mobile Subject Selection", "Review & Pay"],                                flagged: true  },
  { key: "emis",               label: "EMIS Console",        icon: <RefreshCw className="size-4" />,       screens: ["Integrations", "Sync History"],                                                                                     flagged: true  },
  { key: "hei",                label: "HEI Transfer",        icon: <Building2 className="size-4" />,       screens: ["Portal", "Authorisations"],                                                                                         flagged: true  },
  { key: "payment-gateway",    label: "Payment Gateway",     icon: <CreditCard className="size-4" />,      screens: ["Checkout", "Success", "Reconciliation"],                                                                            flagged: true  },
  { key: "migration",          label: "Migration Console",   icon: <FileCog className="size-4" />,         screens: ["Progress", "Failures"],                                                                                             flagged: true  },
];

export const subjects = [
  { id: "math", name: "CSEC Mathematics", examType: "CSEC", year: 2026 },
  { id: "eng", name: "CSEC English A", examType: "CSEC", year: 2026 },
  { id: "bio", name: "CSEC Biology", examType: "CSEC", year: 2026 },
  { id: "apex", name: "CAPE Applied Mathematics", examType: "CAPE", year: 2026 },
];

export const initialComponents: SubjectComponent[] = [
  { id: "paper1", name: "Paper 01 - Multiple Choice", weighting: 30, carryForward: false, changed: false },
  { id: "paper2", name: "Paper 02 - Structured Questions", weighting: 50, carryForward: false, changed: true },
  { id: "sba", name: "School Based Assessment", weighting: 20, carryForward: true, changed: true },
];

export const initialStages: UploadStage[] = [
  { key: "attendance", label: "Attendance", uploaded: true, rows: 12584, warnings: 0, errors: 0 },
  { key: "mc", label: "MC Responses", uploaded: true, rows: 12584, warnings: 20, errors: 4 },
  { key: "question", label: "Question Scores", uploaded: false, rows: 0, warnings: 0, errors: 0 },
  { key: "sba", label: "SBA Scores", uploaded: false, rows: 0, warnings: 0, errors: 0 },
];

export const initialCandidates: CandidateScore[] = [
  { ucn: "1009234", name: "A. Clarke", attendance: "Present", mc: 28, qp: null, sba: 13, moderation: null },
  { ucn: "1009235", name: "D. James", attendance: "Present", mc: 24, qp: 41, sba: 14, moderation: 2 },
  { ucn: "1009236", name: "L. Grant", attendance: "Absent", mc: null, qp: null, sba: null, moderation: null },
];

export const initialTeacherStudents: TeacherStudent[] = [
  { id: "1", name: "Janelle Clarke", ucn: "1002311", project: 16, lab: 18, test: 8, portfolioUploaded: true, carryForwardEligible: false },
  { id: "2", name: "Anika John", ucn: "1002312", project: 14, lab: 17, test: 7, portfolioUploaded: false, carryForwardEligible: false },
  { id: "3", name: "Liam Singh", ucn: "1002313", project: 0, lab: 0, test: 8, portfolioUploaded: true, carryForwardEligible: true },
];

export const initialInvoices: Invoice[] = [
  { id: "INV-10422", entity: "Kingston High", territory: "Jamaica", amount: 42200, paid: 34000, hold: true, status: "Partial" },
  { id: "INV-10423", entity: "A. Clarke", territory: "Barbados", amount: 180, paid: 180, hold: false, status: "Paid" },
  { id: "INV-10424", entity: "North Port School", territory: "Trinidad", amount: 17900, paid: 0, hold: true, status: "Overdue" },
];

export const initialRegistrarCandidates: RegistrarCandidate[] = [
  { id: "r1", name: "Tiana Brathwaite", ucn: "301114", subjects: ["Maths", "English"], idUploaded: true, ageCheck: "Pass", status: "Pending", notes: "" },
  { id: "r2", name: "Joel King", ucn: "301115", subjects: ["Biology", "Chemistry"], idUploaded: true, ageCheck: "Flag", status: "Info Requested", notes: "Need guardian clarification." },
  { id: "r3", name: "Shanice Forde", ucn: "301116", subjects: ["Maths"], idUploaded: false, ageCheck: "Pass", status: "Rejected", notes: "Missing ID upload." },
];

// ── Role system ────────────────────────────────────────────────────────────────

export const roleLabels: Record<UserRole, string> = {
  "cxc-admin":        "CXC Administrator",
  "school-admin":     "School Administrator",
  "local-registrar":  "Local Registrar",
  "teacher":          "Teacher",
  "private-candidate":"Private Candidate",
};

/** Which modules each role may access in the sidebar. */
export const roleModules: Record<UserRole, ModuleKey[]> = {
  "cxc-admin": [
    "dashboard","subject-management","scoring","grading","reporting",
    "teacher-portal","billing","admin-console","registrar",
    "centre-management","pattern-library","self-registration",
    "emis","hei","payment-gateway","migration",
  ],
  "school-admin": [
    "dashboard","subject-management","scoring","reporting",
    "teacher-portal","billing",
  ],
  "local-registrar": [
    "dashboard","registrar","emis","reporting",
  ],
  "teacher": [
    "dashboard","teacher-portal",
  ],
  "private-candidate": [
    "self-registration","payment-gateway","hei",
  ],
};

/** Pre-filled demo accounts shown on the login screen. */
export const demoUsers: Record<UserRole, CurrentUser> = {
  "cxc-admin": {
    name: "Marcus Wilson",
    email: "mwilson@cxc.org",
    role: "cxc-admin",
    territory: "Headquarters",
    avatarInitials: "MW",
  },
  "school-admin": {
    name: "Gloria Grant",
    email: "g.grant@kingstonhigh.edu",
    role: "school-admin",
    territory: "Jamaica",
    avatarInitials: "GG",
  },
  "local-registrar": {
    name: "Raymond Philip",
    email: "r.philip@barbados.gov",
    role: "local-registrar",
    territory: "Barbados",
    avatarInitials: "RP",
  },
  "teacher": {
    name: "Andrea James",
    email: "a.james@hopehigh.edu",
    role: "teacher",
    territory: "Trinidad",
    avatarInitials: "AJ",
  },
  "private-candidate": {
    name: "Tiana Brathwaite",
    email: "t.brathwaite@gmail.com",
    role: "private-candidate",
    territory: "Barbados",
    avatarInitials: "TB",
  },
};

export function currency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: amount > 1000 ? "XCD" : "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
