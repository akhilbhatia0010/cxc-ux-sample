import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  ChevronRight,
  Eye,
  EyeOff,
  FolderTree,
  GraduationCap,
  Info,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  Upload,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  currency,
  demoUsers,
  initialCandidates,
  initialComponents,
  initialInvoices,
  initialRegistrarCandidates,
  initialStages,
  initialTeacherStudents,
  FEATURE_FLAGS,
  navItems,
  roleLabels,
  roleModules,
  subjects,
} from "./data";
import { Panel, Pill, StatCard, StatusBadge } from "./primitives";
import type { CurrentUser, ModuleKey, RegistrarCandidate, UserRole } from "./types";

function App() {
  const [activeModule, setActiveModule] = useState<ModuleKey>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

  const [selectedSubjectId, setSelectedSubjectId] = useState("math");
  const [subjectComponents, setSubjectComponents] = useState(initialComponents);
  const [subjectStatus, setSubjectStatus] = useState<"Draft" | "Published">("Draft");
  const [selectedSubjectTab, setSelectedSubjectTab] = useState("Components & Weighting");

  const [uploadStages, setUploadStages] = useState(initialStages);
  const [candidateScores, setCandidateScores] = useState(initialCandidates);
  const [recalcText, setRecalcText] = useState("");
  const [pipelineLog, setPipelineLog] = useState<string[]>([
    "10:16 AM: Moderation blocked until SBA validation completes.",
    "10:04 AM: Missing mark rule updated for late scripts.",
    "09:18 AM: MC response import recalculated 12,482 candidates.",
  ]);

  const [boundaries, setBoundaries] = useState([23, 41, 58, 76, 88]);
  const [committeeApproved, setCommitteeApproved] = useState([true, true, false, true, false]);
  const [showPreviousYear, setShowPreviousYear] = useState(true);

  // ── Grading Workbench state ────────────────────────────────────────────────
  const [gradingLevel, setGradingLevel] = useState("CSEC ®");
  const [gradingSession, setGradingSession] = useState("JUNE 2025");
  const [gradingStartQual, setGradingStartQual] = useState("01207 - BIOLOGY GENERAL");
  const [gradingEndQual, setGradingEndQual] = useState("01207 - BIOLOGY GENERAL");
  const [gradingStartFac, setGradingStartFac] = useState("<First>");
  const [gradingEndFac, setGradingEndFac] = useState("<Last>");
  const [gradingStartDistrict, setGradingStartDistrict] = useState("<First>");
  const [gradingEndDistrict, setGradingEndDistrict] = useState("<Last>");
  const [trialRunCount, setTrialRunCount] = useState(3);
  const [gradeBoundaries, setGradeBoundaries] = useState([
    { grade: "I",   original: 146, current: 146 },
    { grade: "II",  original: 120, current: 120 },
    { grade: "III", original: 90,  current: 90  },
    { grade: "IV",  original: 60,  current: 60  },
    { grade: "V",   original: 30,  current: 30  },
    { grade: "VI",  original: 0,   current: 0   },
  ]);
  const [profileData, setProfileData] = useState<Array<{
    id: number;
    values: (number | null)[];
    boundarySet: string;
  }>>([
    { id: 1, values: [71, 60, 48, 29, 15, 0],             boundarySet: "2" },
    { id: 2, values: [44, 36, 25, 18, 10, 0],             boundarySet: "3" },
    { id: 3, values: [31, 24, 17, 13, 5,  0],             boundarySet: "4" },
    { id: 4, values: [null, null, null, null, null, null], boundarySet: ""  },
  ]);
  const [gradeBoundarySet, setGradeBoundarySet] = useState("1");
  const [gradingStyle, setGradingStyle] = useState<"Normal" | "Music" | "Typewriting" | "Visual Arts">("Normal");
  const [checkDecisions, setCheckDecisions] = useState(true);
  const [gradeAllCandidates, setGradeAllCandidates] = useState(true);
  const [calculateUngraded, setCalculateUngraded] = useState(false);
  const [writeToReprint, setWriteToReprint] = useState(false);
  const [profileGradingTab, setProfileGradingTab] = useState<"details" | "selection">("details");
  const [gradingSubject, setGradingSubject] = useState("01207 BIOLOGY GENERAL");
  const [gradingBoundarySet, setGradingBoundarySet] = useState(1);
  const [gradingInProgress, setGradingInProgress] = useState(false);
  const [gradingProgressPct, setGradingProgressPct] = useState(0);
  const gradingProfiles = [
    { seq: 1, profile: "UNDERSTANDING", boundarySet: 2, stdError: 2 },
    { seq: 2, profile: "EXPRESSION",    boundarySet: 3, stdError: 2 },
  ];

  const [reportParams, setReportParams] = useState({
    year: "2026",
    territory: "All Territories",
    subject: "CSEC Mathematics",
    candidateType: "All Candidates",
    format: "PDF",
  });

  const [teacherStudents, setTeacherStudents] = useState(initialTeacherStudents);
  const [selectedTeacherStudent, setSelectedTeacherStudent] = useState("1");

  const [invoices, setInvoices] = useState(initialInvoices);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("INV-10422");

  const [regWindow, setRegWindow] = useState({
    open: "2026-06-01",
    close: "2026-07-31",
    late: "2026-08-07",
    cutoff: "2026-08-14",
  });

  const [registrarCandidates, setRegistrarCandidates] = useState(initialRegistrarCandidates);
  const [selectedRegistrarId, setSelectedRegistrarId] = useState("r1");
  const [registrarComment, setRegistrarComment] = useState("");

  // ── Auth / role state ──────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loginRole, setLoginRole] = useState<UserRole>("cxc-admin");
  const [loginEmail, setLoginEmail] = useState("mwilson@cxc.org");
  const [loginPassword, setLoginPassword] = useState("demo1234");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as ModuleKey;
    if (navItems.some((item) => item.key === hash)) {
      setActiveModule(hash);
    }
  }, []);

  useEffect(() => {
    window.location.hash = activeModule;
  }, [activeModule]);

  const roleFilteredNav = useMemo(() => {
    const visibleByFlag = (item: (typeof navItems)[number]) =>
      !item.flagged || FEATURE_FLAGS.showExtraModules;
    if (!currentUser) return navItems.filter(visibleByFlag);
    const allowed = roleModules[currentUser.role];
    return navItems.filter((item) => allowed.includes(item.key) && visibleByFlag(item));
  }, [currentUser]);

  const filteredNav = useMemo(() => {
    if (!query) return roleFilteredNav;
    return roleFilteredNav.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
  }, [query, roleFilteredNav]);

  const selectedSubject = subjects.find((subject) => subject.id === selectedSubjectId) ?? subjects[0];
  const weightingTotal = subjectComponents.reduce((sum, component) => sum + component.weighting, 0);
  const canPublish = weightingTotal === 100;

  const compositeRows = candidateScores.map((candidate) => {
    const composite =
      candidate.attendance === "Absent"
        ? null
        : [candidate.mc, candidate.qp, candidate.sba, candidate.moderation]
            .filter((value): value is number => value !== null)
            .reduce((sum, value) => sum + value, 0);
    return { ...candidate, composite };
  });

  const teacherCompletion = teacherStudents.filter((student) => {
    const hasScores = student.carryForwardEligible || (student.project > 0 && student.lab > 0 && student.test > 0);
    return hasScores && student.portfolioUploaded;
  }).length;
  const teacherReadyToSubmit = teacherCompletion === teacherStudents.length;

  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedInvoiceId) ?? invoices[0];
  const selectedRegistrarCandidate = registrarCandidates.find((candidate) => candidate.id === selectedRegistrarId) ?? registrarCandidates[0];

  const dashboardStats = {
    registrations: 42618,
    schools: 711,
    scoreReady: uploadStages.filter((stage) => stage.uploaded).length,
    collections: invoices.reduce((sum, invoice) => sum + invoice.paid, 0),
  };

  function goTo(moduleKey: ModuleKey) {
    setActiveModule(moduleKey);
    setSidebarOpen(false);
    setActiveScreenIndex(0);
  }

  function updateComponentWeight(id: string, value: number) {
    setSubjectStatus("Draft");
    setSubjectComponents((items) =>
      items.map((item) => (item.id === id ? { ...item, weighting: Number.isNaN(value) ? 0 : value, changed: true } : item)),
    );
  }

  function toggleCarryForward(id: string) {
    setSubjectStatus("Draft");
    setSubjectComponents((items) =>
      items.map((item) => (item.id === id ? { ...item, carryForward: !item.carryForward, changed: true } : item)),
    );
  }

  function simulateUpload(stageKey: string) {
    setUploadStages((items) =>
      items.map((item) =>
        item.key === stageKey
          ? {
              ...item,
              uploaded: true,
              rows: item.rows || 12100,
              warnings: item.key === "sba" ? 90 : item.key === "question" ? 12 : item.warnings,
              errors: item.key === "question" ? 0 : item.errors,
            }
          : item,
      ),
    );
    setPipelineLog((items) => [`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}: ${stageKey} upload completed.`, ...items]);
  }

  function runModeration() {
    setCandidateScores((items) =>
      items.map((candidate) => ({
        ...candidate,
        moderation: candidate.attendance === "Present" && candidate.sba !== null ? 2 : candidate.moderation,
      })),
    );
    setPipelineLog((items) => [`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}: Moderation run completed.`, ...items]);
  }

  function runRecalc() {
    setRecalcText("");
    setPipelineLog((items) => [`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}: Composite score recalculation triggered.`, ...items]);
  }

  function updateTeacherScore(studentId: string, field: "project" | "lab" | "test", value: number) {
    setTeacherStudents((items) =>
      items.map((student) =>
        student.id === studentId
          ? {
              ...student,
              [field]: Math.max(0, value),
            }
          : student,
      ),
    );
  }

  function applyCarryForward(studentId: string) {
    setTeacherStudents((items) =>
      items.map((student) =>
        student.id === studentId
          ? {
              ...student,
              project: 16,
              lab: 18,
              portfolioUploaded: true,
            }
          : student,
      ),
    );
  }

  function togglePortfolio(studentId: string) {
    setTeacherStudents((items) =>
      items.map((student) =>
        student.id === studentId
          ? {
              ...student,
              portfolioUploaded: !student.portfolioUploaded,
            }
          : student,
      ),
    );
  }

  function recordPayment() {
    setInvoices((items) =>
      items.map((invoice) =>
        invoice.id === selectedInvoiceId
          ? { ...invoice, paid: invoice.amount, hold: false, status: "Paid" }
          : invoice,
      ),
    );
  }

  function saveRegistrationDates(field: keyof typeof regWindow, value: string) {
    setRegWindow((current) => ({ ...current, [field]: value }));
  }

  function updateRegistrarDecision(status: RegistrarCandidate["status"]) {
    setRegistrarCandidates((items) =>
      items.map((candidate) =>
        candidate.id === selectedRegistrarId
          ? { ...candidate, status, notes: registrarComment || candidate.notes }
          : candidate,
      ),
    );
    setRegistrarComment("");
  }

  // ── Auth handlers ──────────────────────────────────────────────────────────
  function handleLogin() {
    const user = demoUsers[loginRole];
    setCurrentUser(user);
    const modules = roleModules[loginRole];
    const firstVisible = modules.find((mod) => {
      const item = navItems.find((n) => n.key === mod);
      return item && (!item.flagged || FEATURE_FLAGS.showExtraModules);
    });
    setActiveModule(firstVisible ?? modules[0]);
    setActiveScreenIndex(0);
    setSidebarOpen(false);
  }

  function handleLogout() {
    setCurrentUser(null);
    setActiveModule("dashboard");
    setActiveScreenIndex(0);
  }

  function handleRoleChange(role: UserRole) {
    setLoginRole(role);
    setLoginEmail(demoUsers[role].email);
    setLoginPassword("demo1234");
  }

  // ── Login screen ──────────────────────────────────────────────────────────
  function renderLogin() {
    return (
      <div className="min-h-screen" style={{ background: "var(--cxc-primary)" }}>
        {/* Top white bar */}
        <div className="flex items-center justify-between bg-white px-8 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-[var(--cxc-primary)]">
              <GraduationCap className="size-5 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--cxc-primary)]">CXC EPS</div>
              <div className="text-sm font-bold text-[var(--cxc-heading)]">CARIBBEAN EXAMINATIONS COUNCIL</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-sm text-[var(--cxc-muted)] hover:text-[var(--cxc-heading)]">About</button>
            <button className="text-sm text-[var(--cxc-muted)] hover:text-[var(--cxc-heading)]">Contact</button>
            <Info className="size-5 text-[var(--cxc-muted)]" />
          </div>
        </div>

        {/* Login content */}
        <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 py-12">
          <h1 className="mb-8 text-3xl font-bold text-white">Login to Your Account</h1>

          <div className="w-full max-w-md space-y-4">
            {/* Email */}
            <div>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Email address"
                className="w-full rounded-lg px-4 py-3.5 text-sm text-[var(--cxc-heading)] outline-none placeholder:text-[var(--cxc-muted)]"
                style={{ background: "var(--cxc-input-bg)" }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showLoginPassword ? "text" : "password"}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-lg px-4 py-3.5 text-sm text-[var(--cxc-heading)] outline-none placeholder:text-[var(--cxc-muted)]"
                style={{ background: "var(--cxc-input-bg)" }}
              />
              <button
                onClick={() => setShowLoginPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--cxc-muted)] hover:text-[var(--cxc-heading)]"
              >
                {showLoginPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            {/* Demo role selector — dropdown */}
            <div className="rounded-lg p-4" style={{ background: "rgba(0,0,0,0.15)" }}>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/60">
                Demo — Select Role
              </label>
              <select
                value={loginRole}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="w-full rounded-lg px-4 py-3 text-sm font-semibold text-[var(--cxc-heading)] outline-none"
                style={{ background: "var(--cxc-input-bg)" }}
              >
                {(Object.keys(demoUsers) as UserRole[]).map((role) => (
                  <option key={role} value={role}>
                    {roleLabels[role]} — {demoUsers[role].email}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="w-full rounded-lg py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--cxc-primary-dark)" }}
              onClick={handleLogin}
            >
              Log In
            </button>

            <div className="text-center text-sm text-white/60 hover:text-white/90">
              <button>Forgot Password?</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderSecondaryScreen(title: string, description: string, bullets: string[]) {
    return (
      <Panel title={title} subtitle={description}>
        <div className="space-y-3">
          {bullets.map((bullet) => (
            <div key={bullet} className="rounded-2xl border border-[var(--cxc-border)] bg-[var(--cxc-page)] px-4 py-4 text-sm text-[var(--cxc-muted)]">
              {bullet}
            </div>
          ))}
        </div>
      </Panel>
    );
  }

  function renderDashboard() {
    const role = currentUser?.role ?? "cxc-admin";

    // ── Activity screen (screen index 1, shared across all roles) ──────────
    if (activeScreenIndex === 1) {
      const activityByRole: Record<string, string[]> = {
        "cxc-admin": [
          "Scoring pipeline updated for CSEC Mathematics.",
          "Registration window extended for Belize.",
          "Invoice INV-10422 marked as partially paid.",
          "Committee review awaiting two approvals.",
        ],
        "school-admin": [
          "SBA scores submitted for CSEC Biology.",
          "Invoice INV-10422 partially paid — balance outstanding.",
          "Registration confirmed for 234 candidates.",
          "Teacher A. James updated SBA portfolios.",
        ],
        "local-registrar": [
          "3 candidates pending approval in queue.",
          "EMIS sync completed for Barbados (last run 2h ago).",
          "Joel King — additional info requested.",
          "7 candidates approved this session.",
        ],
        "teacher": [
          "Anika John — portfolio upload pending.",
          "Liam Singh — carry-forward eligible, review required.",
          "SBA submission deadline: 4 days remaining.",
          "Auto-save active for score entry.",
        ],
        "private-candidate": [
          "Registration in progress — Step 3 of 7.",
          "Subject selection not yet finalised.",
          "Payment not yet initiated.",
          "Documents: ID upload pending.",
        ],
      };
      const entries = activityByRole[role] ?? activityByRole["cxc-admin"];
      return (
        <Panel title="Recent Activity" subtitle="Operational events relevant to your role.">
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry} className="rounded-xl border border-[var(--cxc-border)] bg-[var(--cxc-page)] px-4 py-4 text-sm text-[var(--cxc-muted)]">
                {entry}
              </div>
            ))}
          </div>
        </Panel>
      );
    }

    // ── Overview screen — role-specific KPIs & workflows ───────────────────
    if (role === "school-admin") {
      return (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="My School Registrations" value="234" detail="Kingston High · 2026 cycle" icon={<Users className="size-4" />} />
            <StatCard label="Subjects Registered" value="8" detail="CSEC cycle" icon={<FolderTree className="size-4" />} />
            <StatCard label="SBA Submitted" value="3 / 4" detail="1 subject still pending" icon={<Upload className="size-4" />} />
            <StatCard label="Outstanding Balance" value="XCD 8,200" detail="Invoice INV-10422" icon={<Wallet className="size-4" />} />
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <Panel title="Priority Actions" subtitle="Items requiring your attention today.">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ["SBA scores pending for Biology", "teacher-portal"],
                  ["Outstanding invoice balance", "billing"],
                  ["Review scoring pipeline status", "scoring"],
                  ["Download latest reports", "reporting"],
                ].map(([label, key]) => (
                  <button key={label} onClick={() => goTo(key as ModuleKey)}
                    className="flex items-center justify-between rounded-xl border border-[var(--cxc-border)] bg-[var(--cxc-page)] px-4 py-4 text-left hover:border-[var(--cxc-primary)] hover:bg-blue-50">
                    <span className="text-sm font-medium text-[var(--cxc-ink)]">{label}</span>
                    <ChevronRight className="size-4 text-[var(--cxc-primary)]" />
                  </button>
                ))}
              </div>
            </Panel>
            <Panel title="Cycle Timeline" subtitle="Key dates for the current exam cycle.">
              <div className="space-y-3">
                {[["Registration closes","31 July 2026"],["Exam window","6 Jan 2027"],["Results release","14 Aug 2027"]].map(([l,d]) => (
                  <div key={l} className="flex items-center justify-between rounded-xl border border-[var(--cxc-border)] px-4 py-3">
                    <div className="text-sm font-medium text-[var(--cxc-ink)]">{l}</div>
                    <div className="text-sm text-[var(--cxc-muted)]">{d}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      );
    }

    if (role === "teacher") {
      return (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="My Classes" value="3" detail="Active SBA subjects" icon={<GraduationCap className="size-4" />} />
            <StatCard label="Submission Deadline" value="4 days" detail="SBA scores due" icon={<AlertTriangle className="size-4" />} />
            <StatCard label="Portfolios Pending" value="1" detail="Anika John" icon={<Upload className="size-4" />} />
            <StatCard label="Candidates Complete" value="2 / 3" detail="Ready to submit" icon={<Users className="size-4" />} />
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <Panel title="Pending Actions" subtitle="Items to resolve before the SBA deadline.">
              <div className="space-y-3">
                {[
                  ["Portfolio upload needed — Anika John", "teacher-portal"],
                  ["Review carry-forward for Liam Singh", "teacher-portal"],
                ].map(([label, key]) => (
                  <button key={label} onClick={() => goTo(key as ModuleKey)}
                    className="flex w-full items-center justify-between rounded-xl border border-[var(--cxc-border)] bg-[var(--cxc-page)] px-4 py-4 text-left hover:border-[var(--cxc-primary)] hover:bg-blue-50">
                    <span className="text-sm font-medium text-[var(--cxc-ink)]">{label}</span>
                    <ChevronRight className="size-4 text-[var(--cxc-primary)]" />
                  </button>
                ))}
              </div>
            </Panel>
            <Panel title="Class Summary" subtitle="Across all active subjects.">
              <div className="space-y-3 text-sm">
                {[["Total students","3"],["Portfolios uploaded","2"],["Carry-forward eligible","1"],["Avg project score","10 / 20"]].map(([l,v]) => (
                  <div key={l} className="flex justify-between rounded-xl border border-[var(--cxc-border)] px-4 py-3">
                    <span className="text-[var(--cxc-muted)]">{l}</span>
                    <span className="font-semibold text-[var(--cxc-ink)]">{v}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      );
    }

    if (role === "local-registrar") {
      return (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Approval Queue" value="3" detail="Pending review" icon={<ShieldCheck className="size-4" />} />
            <StatCard label="Approved Today" value="7" detail="This session" icon={<Users className="size-4" />} />
            <StatCard label="Info Requested" value="1" detail="Joel King" icon={<AlertTriangle className="size-4" />} />
            <StatCard label="SLA Status" value="On Track" detail="Within 5-day window" icon={<BarChart3 className="size-4" />} />
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <Panel title="Priority Actions" subtitle="Your registrar queue today.">
              <div className="space-y-3">
                {[
                  ["3 candidates awaiting approval", "registrar"],
                  ["EMIS sync pending for Belize", "emis"],
                  ["Generate ministry report", "reporting"],
                ].map(([label, key]) => (
                  <button key={label} onClick={() => goTo(key as ModuleKey)}
                    className="flex w-full items-center justify-between rounded-xl border border-[var(--cxc-border)] bg-[var(--cxc-page)] px-4 py-4 text-left hover:border-[var(--cxc-primary)] hover:bg-blue-50">
                    <span className="text-sm font-medium text-[var(--cxc-ink)]">{label}</span>
                    <ChevronRight className="size-4 text-[var(--cxc-primary)]" />
                  </button>
                ))}
              </div>
            </Panel>
            <Panel title="Territory Summary" subtitle="Barbados — current cycle.">
              <div className="space-y-3 text-sm">
                {[["Registered candidates","318"],["Approved","293"],["Pending","3"],["Rejected","22"]].map(([l,v]) => (
                  <div key={l} className="flex justify-between rounded-xl border border-[var(--cxc-border)] px-4 py-3">
                    <span className="text-[var(--cxc-muted)]">{l}</span>
                    <span className="font-semibold text-[var(--cxc-ink)]">{v}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      );
    }

    // ── CXC Admin (default) ────────────────────────────────────────────────
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Registrations YTD" value={dashboardStats.registrations.toLocaleString()} detail="Across all territories" icon={<Users className="size-4" />} />
          <StatCard label="Active Schools" value={dashboardStats.schools.toString()} detail="711 schools in cycle 2026" icon={<Building2 className="size-4" />} />
          <StatCard label="Scoring Stages Ready" value={`${dashboardStats.scoreReady}/4`} detail="Upload pipeline in progress" icon={<Upload className="size-4" />} />
          <StatCard label="Collected Payments" value={currency(dashboardStats.collections)} detail="Current processed remittances" icon={<Wallet className="size-4" />} />
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Panel title="Priority Workflows" subtitle="Jump into the busiest operational modules.">
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ["Subject setup needs publish", "subject-management"],
                ["Question scores still pending", "scoring"],
                ["Committee approvals outstanding", "grading"],
                ["Three invoices on hold", "billing"],
              ].map(([label, key]) => (
                <button key={label} onClick={() => goTo(key as ModuleKey)}
                  className="flex items-center justify-between rounded-xl border border-[var(--cxc-border)] bg-[var(--cxc-page)] px-4 py-4 text-left hover:border-[var(--cxc-primary)] hover:bg-blue-50">
                  <span className="text-sm font-medium text-[var(--cxc-ink)]">{label}</span>
                  <ChevronRight className="size-4 text-[var(--cxc-primary)]" />
                </button>
              ))}
            </div>
          </Panel>
          <Panel title="Cycle Timeline" subtitle="Key dates for the current exam cycle.">
            <div className="space-y-3">
              {[["Registration opens","1 June 2026"],["Registration closes","31 July 2026"],["Exam window","6 January 2027"],["Results release","14 August 2027"]].map(([label, date]) => (
                <div key={label} className="flex items-center justify-between rounded-xl border border-[var(--cxc-border)] px-4 py-3">
                  <div className="text-sm font-medium text-[var(--cxc-ink)]">{label}</div>
                  <div className="text-sm text-[var(--cxc-muted)]">{date}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    );
  }

  function renderSubjectManagement() {
    if (activeScreenIndex === 0) {
      return (
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <Panel title="Subjects" subtitle="Choose a subject to open its yearly configuration.">
            <div className="space-y-2">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => {
                    setSelectedSubjectId(subject.id);
                    setActiveScreenIndex(1);
                  }}
                  className={`w-full rounded-2xl px-4 py-3 text-left ${selectedSubjectId === subject.id ? "bg-[var(--cxc-primary)] text-white" : "bg-[var(--cxc-page)] text-[var(--cxc-ink)] hover:bg-[#eef5f8]"}`}
                >
                  <div className="text-xs uppercase tracking-[0.16em] opacity-75">{subject.examType}</div>
                  <div className="mt-1 font-semibold">{subject.name}</div>
                </button>
              ))}
            </div>
          </Panel>
          <Panel title="Select a subject to begin" subtitle="This matches the app-style starting state from the prompt.">
            <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-[var(--cxc-border)] bg-[var(--cxc-page)] p-8 text-center">
              <div>
                <FolderTree className="mx-auto size-12 text-[var(--cxc-primary)]" />
                <div className="mt-4 text-xl font-semibold text-[var(--cxc-heading)]">Open a subject from the left menu</div>
                <div className="mt-2 max-w-md text-sm text-[var(--cxc-muted)]">
                  Components, weighting, carry-forward rules, and publishing controls will load here.
                </div>
              </div>
            </div>
          </Panel>
        </div>
      );
    }
    return (
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <Panel title="Subjects" subtitle="Grouped by exam type and searchable.">
          <div className="space-y-2">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id)}
                  className={`w-full rounded-2xl px-4 py-3 text-left ${selectedSubjectId === subject.id ? "bg-[var(--cxc-primary)] text-white" : "bg-[var(--cxc-page)] text-[var(--cxc-ink)] hover:bg-[#eef5f8]"}`}
              >
                <div className="text-xs uppercase tracking-[0.16em] opacity-75">{subject.examType}</div>
                <div className="mt-1 font-semibold">{subject.name}</div>
              </button>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel
            title={selectedSubject.name}
            subtitle={`${selectedSubject.year} cycle`}
            action={
              <div className="flex items-center gap-3">
                <StatusBadge status={subjectStatus} />
                <button
                  onClick={() => setSubjectStatus("Published")}
                  disabled={!canPublish}
                  className="rounded-2xl bg-[var(--cxc-accent)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Publish
                </button>
              </div>
            }
          >
            {/* Tab bar — all tabs interactive */}
            <div className="mb-4 flex flex-wrap gap-2">
              {["Modules", "Profiles", "Components & Weighting", "Sections & Questions", "Registration Options", "Boundaries / Hurdles"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedSubjectTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedSubjectTab === tab
                      ? "bg-[var(--cxc-primary)] text-white"
                      : "border border-[var(--cxc-border)] bg-[var(--cxc-page)] text-[var(--cxc-muted)] hover:border-[var(--cxc-primary)] hover:text-[var(--cxc-ink)]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* ── Modules tab ─────────────────────────────────────── */}
            {selectedSubjectTab === "Modules" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-[var(--cxc-border)] bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  A subject can have one or several modules. Each module has its own components, sections, and profiles.
                </div>
                <div className="overflow-hidden rounded-2xl border border-[var(--cxc-border)]">
                  <div className="grid grid-cols-[80px_1fr_120px_100px] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cxc-muted)]">
                    <div>Code</div><div>Module Name</div><div>Type</div><div>Status</div>
                  </div>
                  {[{ code: "01", name: `${selectedSubject.name} — General`, type: "General", status: "Active" }].map((mod) => (
                    <div key={mod.code} className="grid grid-cols-[80px_1fr_120px_100px] items-center px-4 py-3 bg-white">
                      <div className="font-mono text-sm text-[var(--cxc-primary)]">{mod.code}</div>
                      <div className="font-medium text-[var(--cxc-ink)]">{mod.name}</div>
                      <div className="text-sm text-slate-500">{mod.type}</div>
                      <StatusBadge status={mod.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Profiles tab ────────────────────────────────────── */}
            {selectedSubjectTab === "Profiles" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-[var(--cxc-border)] bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  Profiles define distinct dimensions of assessment (e.g., Understanding, Expression). Each profile maps to a component and has its own A–F boundaries set in the Grading Workbench.
                </div>
                <div className="overflow-hidden rounded-2xl border border-[var(--cxc-border)]">
                  <div className="grid grid-cols-[60px_1fr_1fr_120px] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cxc-muted)]">
                    <div>Seq</div><div>Profile Name</div><div>Linked Component</div><div>Max Marks</div>
                  </div>
                  {[
                    { seq: 1, name: "Multiple Choice",      component: "Paper 01 — MC",          max: 60  },
                    { seq: 2, name: "Structured Questions", component: "Paper 02 — Structured",   max: 90  },
                    { seq: 3, name: "School Based Assessment", component: "SBA Portfolio",         max: 50  },
                  ].map((p, idx) => (
                    <div key={p.seq} className={`grid grid-cols-[60px_1fr_1fr_120px] items-center px-4 py-3 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                      <div className="text-sm text-slate-500">{p.seq}</div>
                      <div className="font-medium text-[var(--cxc-ink)]">{p.name}</div>
                      <div className="text-sm text-slate-500">{p.component}</div>
                      <div className="text-sm text-slate-700">{p.max}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Components & Weighting tab ───────────────────────── */}
            {selectedSubjectTab === "Components & Weighting" && (
              <>
                <div className="overflow-hidden rounded-3xl border border-[var(--cxc-border)]">
                  <div className="grid grid-cols-[1.2fr_120px_150px_120px] bg-[var(--cxc-page)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cxc-muted)]">
                    <div>Component</div><div>Weight</div><div>Carry Forward</div><div>Status</div>
                  </div>
                  {subjectComponents.map((component, index) => (
                    <div key={component.id} className={`grid grid-cols-[1.2fr_120px_150px_120px] items-center gap-4 px-4 py-3 ${index % 2 === 0 ? "bg-white" : "bg-[#fbfcfd]"}`}>
                      <div className="font-medium text-[var(--cxc-ink)]">{component.name}</div>
                      <input
                        type="number"
                        value={component.weighting}
                        onChange={(event) => updateComponentWeight(component.id, Number(event.target.value))}
                        className="rounded-xl border border-[var(--cxc-border)] bg-white px-3 py-2"
                      />
                      <button
                        onClick={() => toggleCarryForward(component.id)}
                        className={`rounded-xl px-3 py-2 text-sm font-semibold ${component.carryForward ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"}`}
                      >
                        {component.carryForward ? "Enabled" : "Disabled"}
                      </button>
                      <StatusBadge status={component.changed ? "Changed" : "Aligned"} />
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--cxc-border)] bg-[var(--cxc-page)] px-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-[var(--cxc-ink)]">Weighting total</div>
                    <div className={`text-2xl font-bold ${canPublish ? "text-emerald-600" : "text-rose-600"}`}>{weightingTotal}%</div>
                  </div>
                  <div className="max-w-md text-sm text-[var(--cxc-muted)]">Publish unlocks only when the component weighting sums to 100% and the structure has been reviewed.</div>
                </div>
              </>
            )}

            {/* ── Sections & Questions tab ─────────────────────────── */}
            {selectedSubjectTab === "Sections & Questions" && (
              <div className="space-y-4">
                {[
                  {
                    component: "Paper 01 — Multiple Choice",
                    sections: [{ name: "Section A", questions: [{ label: "Q1–60", marks: 1, total: 60, profiles: "Profile 1" }] }],
                  },
                  {
                    component: "Paper 02 — Structured Questions",
                    sections: [
                      { name: "Section A — Short Answer", questions: [
                        { label: "Q1", marks: 15, total: 15, profiles: "Profile 2" },
                        { label: "Q2", marks: 15, total: 15, profiles: "Profile 2" },
                        { label: "Q3", marks: 15, total: 15, profiles: "Profile 2" },
                      ]},
                      { name: "Section B — Extended Response", questions: [
                        { label: "Q4", marks: 30, total: 30, profiles: "Profile 2" },
                        { label: "Q5 (optional)", marks: 30, total: 30, profiles: "Profile 2" },
                      ]},
                    ],
                  },
                ].map((comp) => (
                  <div key={comp.component} className="overflow-hidden rounded-2xl border border-[var(--cxc-border)]">
                    <div className="bg-[var(--cxc-primary)] px-4 py-2.5 text-sm font-semibold text-white">{comp.component}</div>
                    {comp.sections.map((sec) => (
                      <div key={sec.name}>
                        <div className="border-t border-[var(--cxc-border)] bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{sec.name}</div>
                        {sec.questions.map((q, qi) => (
                          <div key={qi} className={`grid grid-cols-[1fr_100px_100px_140px] items-center px-4 py-2.5 text-sm ${qi % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                            <div className="font-medium text-[var(--cxc-ink)]">{q.label}</div>
                            <div className="text-slate-500">{q.marks} mark{q.marks > 1 ? "s" : ""}</div>
                            <div className="text-slate-500">Total: {q.total}</div>
                            <div className="text-xs text-[var(--cxc-primary)]">{q.profiles}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* ── Registration Options tab ─────────────────────────── */}
            {selectedSubjectTab === "Registration Options" && (
              <div className="space-y-3">
                <div className="rounded-2xl border border-[var(--cxc-border)] bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  Registration options control eligibility, dual entry, carry-forward, and re-sit rules for this subject.
                </div>
                {[
                  ["Allow carry-forward results",       true ],
                  ["Dual entry permitted",               false],
                  ["Alternative dual entry permitted",   false],
                  ["Re-sit permitted",                   true ],
                  ["School-based assessment required",   true ],
                  ["Private candidate eligible",         true ],
                  ["RM session setup required",          true ],
                ].map(([label, checked]) => (
                  <label key={label as string} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[var(--cxc-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--cxc-ink)] hover:bg-slate-50">
                    <input
                      type="checkbox"
                      defaultChecked={checked as boolean}
                      className="accent-[var(--cxc-primary)]"
                      readOnly
                    />
                    {label}
                  </label>
                ))}
              </div>
            )}

            {/* ── Boundaries / Hurdles tab ─────────────────────────── */}
            {selectedSubjectTab === "Boundaries / Hurdles" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Grade boundaries and hurdle values are configured in the Grading Workbench. Changes here affect all trial grading runs for this subject.
                </div>
                <div className="overflow-hidden rounded-2xl border border-[var(--cxc-border)]">
                  <div className="grid grid-cols-[80px_1fr_140px_140px] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cxc-muted)]">
                    <div>Grade</div><div>Boundary Description</div><div>Min Score</div><div>Hurdle Rule</div>
                  </div>
                  {[
                    { grade: "I",   desc: "Distinction",  min: 146, hurdle: "All profiles ≥ A" },
                    { grade: "II",  desc: "Merit",        min: 120, hurdle: "All profiles ≥ B" },
                    { grade: "III", desc: "Credit",       min: 90,  hurdle: "All profiles ≥ C" },
                    { grade: "IV",  desc: "General",      min: 60,  hurdle: "None"              },
                    { grade: "V",   desc: "Pass",         min: 30,  hurdle: "None"              },
                    { grade: "VI",  desc: "Fail",         min: 0,   hurdle: "N/A"               },
                  ].map((row, idx) => (
                    <div key={row.grade} className={`grid grid-cols-[80px_1fr_140px_140px] items-center px-4 py-3 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                      <div className="font-semibold text-[var(--cxc-ink)]">{row.grade}</div>
                      <div className="text-sm text-slate-600">{row.desc}</div>
                      <div className="text-sm text-slate-500">{row.min}</div>
                      <div className="text-xs text-slate-500">{row.hurdle}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => goTo("grading")}
                    className="rounded-2xl bg-[var(--cxc-primary)] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Open Grading Workbench
                  </button>
                </div>
              </div>
            )}
          </Panel>
        </div>
      </div>
    );
  }

  function renderScoring() {
    if (activeScreenIndex === 1) {
      return (
        <Panel title="Recalculation Confirmation" subtitle="Explicit confirmation before rerunning composite scores.">
          <div className="max-w-2xl space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
              This action will update downstream composites, trial grading views, and stale reports.
            </div>
            <input
              value={recalcText}
              onChange={(event) => setRecalcText(event.target.value)}
              className="w-full rounded-2xl border border-[var(--cxc-border)] px-4 py-3"
              placeholder="Type RECALCULATE"
            />
            <div className="flex gap-3">
              <button
                onClick={runRecalc}
                disabled={recalcText !== "RECALCULATE"}
                className="rounded-2xl bg-[var(--cxc-accent)] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300"
              >
                Confirm
              </button>
              <button
                onClick={() => setRecalcText("")}
                className="rounded-2xl border border-[var(--cxc-border)] px-4 py-2 text-sm font-semibold text-[var(--cxc-ink)]"
              >
                Reset
              </button>
            </div>
          </div>
        </Panel>
      );
    }
    const moderationReady = uploadStages.some((stage) => stage.key === "sba" && stage.uploaded);
    const stageSubLabels: Record<string, string> = {
      attendance: "Mark present / absent before scoring begins",
      mc: "Score MC responses automatically on upload · Re-score if any response changes",
      question: "Includes Transfers, Alt Duals, and Re-sits",
      sba: "Includes SBA Duals · Triggers moderation on upload",
    };
    return (
      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-4">
          {uploadStages.map((stage) => (
            <Panel
              key={stage.key}
              title={stage.label}
              subtitle={stage.uploaded ? `${stage.rows.toLocaleString()} rows uploaded` : "Waiting for upload"}
              action={
                <button
                  onClick={() => simulateUpload(stage.key)}
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  {stage.uploaded ? "Replace" : "Upload"}
                </button>
              }
            >
              <div className="space-y-2 text-sm text-slate-500">
                <div className="text-xs text-slate-400">{stageSubLabels[stage.key]}</div>
                <div>{stage.uploaded ? `${stage.warnings} warnings` : "Not yet loaded"}</div>
                <div>{stage.uploaded ? `${stage.errors} errors` : "Prerequisites pending"}</div>
              </div>
            </Panel>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Panel
            title="Candidate Preview"
            subtitle="Composite scores update automatically when uploads or moderation change."
            action={<Pill>Mid Pipeline</Pill>}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    {["UCN", "Name", "Attendance", "MC", "Q Paper", "SBA", "Moderation", "Composite"].map((heading) => (
                      <th key={heading} className="px-4 py-3">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compositeRows.map((candidate, index) => (
                    <tr key={candidate.ucn} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/70"}>
                      <td className="px-4 py-3">{candidate.ucn}</td>
                      <td className="px-4 py-3">{candidate.name}</td>
                      <td className="px-4 py-3">{candidate.attendance}</td>
                      <td className="px-4 py-3">{candidate.mc ?? <i>Missing</i>}</td>
                      <td className="px-4 py-3">{candidate.qp ?? <i>Missing</i>}</td>
                      <td className="px-4 py-3">{candidate.sba ?? <i>Missing</i>}</td>
                      <td className="px-4 py-3">{candidate.moderation ?? "-"}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{candidate.composite ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={runModeration}
                disabled={!moderationReady}
                className="rounded-2xl bg-[var(--cxc-primary)] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300"
              >
                Run Moderation
              </button>
              <button
                onClick={() => setActiveScreenIndex(1)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Trigger Recalc
              </button>
            </div>
          </Panel>

          <Panel title="Pipeline Events" subtitle="Most recent recalculation and upload activity.">
            <div className="space-y-3">
              {pipelineLog.map((entry) => (
                <div key={entry} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  {entry}
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Calculate Missing Marks ── from the Scoring flowchart */}
        <Panel
          title="Calculate Missing Marks"
          subtitle="Apply missing mark rules before composite score finalisation."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Rule",     value: "Absent — zero all components" },
              { label: "Rule",     value: "Present but no MC — substitute mean score" },
              { label: "Rule",     value: "Late script — apply late-mark cap (80%)" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-2xl border border-[var(--cxc-border)] bg-[var(--cxc-page)] px-4 py-3">
                <div className="mt-0.5 size-2 flex-shrink-0 rounded-full bg-[var(--cxc-primary)]" />
                <span className="text-sm text-slate-600">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setPipelineLog((items) => [
                `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}: Missing mark rules applied to all candidates.`,
                ...items,
              ])}
              className="rounded-2xl bg-[var(--cxc-primary)] px-4 py-2 text-sm font-semibold text-white"
            >
              Apply Missing Mark Rules
            </button>
            <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
              Edit Rules
            </button>
          </div>
        </Panel>
      </div>
    );
  }

  function startGradingRun(onComplete: () => void) {
    setGradingInProgress(true);
    setGradingProgressPct(0);
    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.floor(Math.random() * 12) + 6;
      if (pct >= 100) {
        pct = 100;
        clearInterval(interval);
        setTimeout(() => {
          setGradingInProgress(false);
          setGradingProgressPct(0);
          onComplete();
        }, 400);
      }
      setGradingProgressPct(pct);
    }, 180);
  }

  function GradingInProgressOverlay() {
    if (!gradingInProgress) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-80 rounded-2xl bg-white p-6 shadow-2xl">
          <div className="mb-1 text-base font-semibold text-[var(--cxc-heading)]">Grading In Progress</div>
          <div className="mb-4 text-sm text-[var(--cxc-muted)]">
            Processing candidates for {gradingStartQual}… This may take several minutes.
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full bg-[var(--cxc-primary)] transition-all duration-200"
              style={{ width: `${gradingProgressPct}%` }}
            />
          </div>
          <div className="mt-2 text-right text-xs text-[var(--cxc-muted)]">{gradingProgressPct}%</div>
        </div>
      </div>
    );
  }

  function renderGrading() {
    // ── Screen 4: Committee Review ───────────────────────────────────────────
    if (activeScreenIndex === 4) {
      const approvals = committeeApproved.filter(Boolean).length;
      return (
        <Panel title="Committee Review" subtitle={`${approvals}/5 approvals recorded`}>
          <div className="space-y-3">
            {["Chair", "Psychometrician", "Chief Examiner", "Assessment Lead", "CXC Admin"].map((member, index) => (
              <div key={member} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <div>
                  <div className="font-medium text-slate-700">{member}</div>
                  <div className="text-sm text-slate-500">{committeeApproved[index] ? "Approved" : "Pending"}</div>
                </div>
                <button
                  onClick={() => setCommitteeApproved((items) => items.map((item, itemIndex) => (itemIndex === index ? !item : item)))}
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  Toggle
                </button>
              </div>
            ))}
          </div>
        </Panel>
      );
    }

    // ── Screen 5: Hardship Queue ─────────────────────────────────────────────
    if (activeScreenIndex === 5) {
      return (
        <Panel title="Hardship Queue" subtitle="Audited uplift review.">
          <div className="space-y-3">
            {[
              ["A. Edwards", "IV", "III"],
              ["K. Ramnarine", "III", "II"],
              ["S. Joseph", "Pass", "Pass+"],
            ].map(([name, current, uplift]) => (
              <div key={name} className="rounded-2xl border border-slate-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-700">{name}</div>
                    <div className="text-sm text-slate-500">Current: {current}</div>
                  </div>
                  <StatusBadge status={`Recommend ${uplift}`} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      );
    }

    // ── Screen 1: Grade Boundaries ───────────────────────────────────────────
    if (activeScreenIndex === 1) {
      const profileColumns = ["A", "B", "C", "D", "E", "F"];
      return (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--cxc-border)] bg-white px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Subject Code</span>
              <span className="font-bold text-[var(--cxc-primary)]">01207 — BIOLOGY GENERAL</span>
            </div>
            <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              Step 1 of grading flow — Validate Boundaries &amp; Hurdles before running trial grading
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
            {/* Overall grade boundaries */}
            <Panel title="Grades" subtitle="Set boundary scores for each grade. Hurdle rules are configured in Subject Management → Boundaries / Hurdles.">
              <div className="overflow-hidden rounded-2xl border border-[var(--cxc-border)]">
                <div className="grid grid-cols-3 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  <div>Grade</div>
                  <div>Boundary</div>
                  <div>Original</div>
                </div>
                {gradeBoundaries.map((row, idx) => (
                  <div key={row.grade} className={`grid grid-cols-3 items-center px-4 py-2.5 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                    <div className="font-semibold text-[var(--cxc-ink)]">{row.grade}</div>
                    <input
                      type="number"
                      value={row.current}
                      onChange={(e) => setGradeBoundaries((items) => items.map((item, i) => i === idx ? { ...item, current: Number(e.target.value) } : item))}
                      className="w-20 rounded-xl border border-[var(--cxc-border)] px-3 py-1.5 text-sm"
                    />
                    <div className="text-sm text-slate-400">{row.original}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium text-slate-700">Select Grade Boundary Set</label>
                <select
                  value={gradeBoundarySet}
                  onChange={(e) => setGradeBoundarySet(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--cxc-border)] px-3 py-2 text-sm"
                >
                  {["1", "2", "3", "4"].map((opt) => <option key={opt}>{opt}</option>)}
                </select>
              </div>
            </Panel>

            {/* Per-profile A–F boundaries */}
            <Panel title="Profiles" subtitle="Grade boundaries (A–F) for each marking profile.">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.15em] text-slate-500">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Profile</th>
                      {profileColumns.map((col) => (
                        <th key={col} className="px-3 py-2 font-semibold">{col}</th>
                      ))}
                      <th className="px-4 py-2 font-semibold">Select Profile Boundary Set</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profileData.map((profile, pIdx) => (
                      <tr key={profile.id} className={pIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                        <td className="px-4 py-2 font-medium text-slate-700">Profile {profile.id}</td>
                        {profile.values.map((val, vIdx) => (
                          <td key={vIdx} className="px-2 py-2">
                            <input
                              type="number"
                              value={val ?? ""}
                              onChange={(e) =>
                                setProfileData((items) =>
                                  items.map((item, i) =>
                                    i === pIdx
                                      ? { ...item, values: item.values.map((v, vi) => vi === vIdx ? (e.target.value === "" ? null : Number(e.target.value)) : v) }
                                      : item,
                                  ),
                                )
                              }
                              className="w-16 rounded-xl border border-[var(--cxc-border)] px-2 py-1.5 text-sm"
                            />
                          </td>
                        ))}
                        <td className="px-4 py-2">
                          <select
                            value={profile.boundarySet}
                            onChange={(e) =>
                              setProfileData((items) =>
                                items.map((item, i) => i === pIdx ? { ...item, boundarySet: e.target.value } : item),
                              )
                            }
                            className="rounded-xl border border-[var(--cxc-border)] px-2 py-1.5 text-sm"
                          >
                            <option value="">—</option>
                            {["1", "2", "3", "4", "5"].map((opt) => <option key={opt}>{opt}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-xs italic text-slate-400">
                * The Frequency Distribution on this form is based on candidates who have been Moderated and officially Graded (Not Trial Grades)
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveScreenIndex(2)}
                  className="rounded-2xl bg-[var(--cxc-primary)] px-4 py-2 text-sm font-semibold text-white"
                >
                  Continue
                </button>
                <button
                  onClick={() => setActiveScreenIndex(0)}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setActiveScreenIndex(2)}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  View Frequency Distribution
                </button>
              </div>
            </Panel>
          </div>
        </div>
      );
    }

    // ── Screen 2: Grade Statistics ───────────────────────────────────────────
    if (activeScreenIndex === 2) {
      const newGradeStats = [
        { profile: 2, grade: "I",   median: 9,  mode: 10, mean: 8.9,  max: 10 },
        { profile: 1, grade: "I",   median: 58, mode: 59, mean: 56.4, max: 60 },
        { profile: 3, grade: "I",   median: 28, mode: 29, mean: 27.7, max: 30 },
        { profile: 2, grade: "II",  median: 8,  mode: 9,  mean: 7.9,  max: 10 },
        { profile: 3, grade: "II",  median: 27, mode: 28, mean: 26.3, max: 30 },
        { profile: 1, grade: "II",  median: 52, mode: 57, mean: 51,   max: 60 },
        { profile: 2, grade: "III", median: 7,  mode: 8,  mean: 6.9,  max: 10 },
        { profile: 3, grade: "III", median: 26, mode: 27, mean: 24.8, max: 30 },
      ];
      const compositeStats = [
        { grade: "I",   median: 94, mode: 96, mean: 93,   max: 100 },
        { grade: "II",  median: 86, mode: 91, mean: 85.3, max: 100 },
        { grade: "III", median: 72, mode: 68, mean: 72.4, max: 96  },
        { grade: "IV",  median: 56, mode: 55, mean: 56.3, max: 87  },
        { grade: "V",   median: 39, mode: 44, mean: 38.4, max: 73  },
        { grade: "VI",  median: 19, mode: 19, mean: 18.4, max: 25  },
      ];
      const prevStats = [
        { grade: "I",   y2023: 3303, y2024: 3504, y2025: 4646 },
        { grade: "II",  y2023: 4217, y2024: 4439, y2025: 5104 },
        { grade: "III", y2023: 5107, y2024: 5089, y2025: 4339 },
        { grade: "IV",  y2023: 3731, y2024: 3446, y2025: 2445 },
        { grade: "V",   y2023: 762,  y2024: 603,  y2025: 355  },
        { grade: "VI",  y2023: 18,   y2024: 7,    y2025: 13   },
      ];
      const hurdleValues = [
        { seed: 7826, seq: 2, itemNo: 0, value: 2, hmSeq: 2, hmValue: 0 },
        { seed: 7826, seq: 2, itemNo: 0, value: 2, hmSeq: 3, hmValue: 0 },
        { seed: 7826, seq: 2, itemNo: 0, value: 2, hmSeq: 4, hmValue: 0 },
        { seed: 7826, seq: 3, itemNo: 0, value: 2, hmSeq: 1, hmValue: 0 },
        { seed: 7826, seq: 3, itemNo: 0, value: 2, hmSeq: 2, hmValue: 0 },
        { seed: 7826, seq: 3, itemNo: 0, value: 2, hmSeq: 3, hmValue: 0 },
        { seed: 7826, seq: 4, itemNo: 0, value: 2, hmSeq: 1, hmValue: 0 },
      ];
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--cxc-border)] bg-white px-5 py-3">
            <span className="text-sm text-slate-500">Subject Code</span>
            <span className="font-bold text-[var(--cxc-primary)]">01207 — BIOLOGY GENERAL</span>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="New Grade Statistics" subtitle="Per-profile statistics from the current trial run.">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.15em] text-slate-500">
                    <tr>
                      {["Profile", "Grade", "Median", "Mode", "Mean", "Max"].map((h) => (
                        <th key={h} className="px-3 py-2 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {newGradeStats.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                        <td className="px-3 py-2">{row.profile}</td>
                        <td className="px-3 py-2 font-semibold">{row.grade}</td>
                        <td className="px-3 py-2">{row.median}</td>
                        <td className="px-3 py-2">{row.mode}</td>
                        <td className="px-3 py-2">{row.mean}</td>
                        <td className="px-3 py-2">{row.max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="Composite For New Stats" subtitle="Combined composite score statistics by grade.">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.15em] text-slate-500">
                    <tr>
                      {["Grade", "C. Median", "C. Mode", "C. Mean", "Max"].map((h) => (
                        <th key={h} className="px-3 py-2 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compositeStats.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                        <td className="px-3 py-2 font-semibold">{row.grade}</td>
                        <td className="px-3 py-2">{row.median}</td>
                        <td className="px-3 py-2">{row.mode}</td>
                        <td className="px-3 py-2">{row.mean}</td>
                        <td className="px-3 py-2">{row.max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="Previous Statistics by Year and Grade" subtitle="Historical grade distribution comparison.">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.15em] text-slate-500">
                    <tr>
                      {["Grade", "202306 Count", "202406 Count", "202506 Count"].map((h) => (
                        <th key={h} className="px-3 py-2 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {prevStats.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                        <td className="px-3 py-2 font-semibold">{row.grade}</td>
                        <td className="px-3 py-2">{row.y2023.toLocaleString()}</td>
                        <td className="px-3 py-2">{row.y2024.toLocaleString()}</td>
                        <td className="px-3 py-2">{row.y2025.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="Hurdle Values Used" subtitle="Hurdle and high-mark thresholds applied in this run.">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.15em] text-slate-500">
                    <tr>
                      {["Seed", "Seq", "Item No", "Value", "HM Seq", "HM Value"].map((h) => (
                        <th key={h} className="px-3 py-2 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {hurdleValues.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                        <td className="px-3 py-2">{row.seed}</td>
                        <td className="px-3 py-2">{row.seq}</td>
                        <td className="px-3 py-2">{row.itemNo}</td>
                        <td className="px-3 py-2">{row.value}</td>
                        <td className="px-3 py-2">{row.hmSeq}</td>
                        <td className="px-3 py-2">{row.hmValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveScreenIndex(1)}
              className="rounded-2xl bg-[var(--cxc-primary)] px-4 py-2 text-sm font-semibold text-white"
            >
              Update Boundaries
            </button>
            <button
              onClick={() => setActiveScreenIndex(0)}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={() => setActiveScreenIndex(1)}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Back
            </button>
            <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
              View Distribution Frequency
            </button>
          </div>
        </div>
      );
    }

    // ── Screen 3: Profile Grading ────────────────────────────────────────────
    if (activeScreenIndex === 3) {
      const centreList = [
        { code: "010001", name: "ALL SAINTS SECONDARY SCHOOL" },
        { code: "010002", name: "ANTIGUA GIRLS HIGH SCHOOL" },
        { code: "010003", name: "ANTIGUA GRAMMAR SCHOOL" },
        { code: "010004", name: "INSTITUTE OF BUSINESS EDUCATION" },
        { code: "010005", name: "CHRIST THE KING HIGH SCHOOL" },
        { code: "010006", name: "CLARE HALL SECONDARY SCHOOL" },
        { code: "010007", name: "AMERICAN INSTITUTE OF TECHNOLOGY" },
      ];
      return (
        <div className="space-y-6">
          <Panel
            title="Profile Grading"
            subtitle="Configure and run the official grading pass."
            action={
              <button
                onClick={() => setActiveScreenIndex(0)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Close
              </button>
            }
          >
            <div className="grid gap-6 xl:grid-cols-[1fr_160px]">
              {/* Main form */}
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-slate-700">Awarding Body</span>
                    <select className="rounded-2xl border border-[var(--cxc-border)] bg-slate-50 px-3 py-2 text-sm text-slate-500">
                      <option>Caribbean Examinations Council</option>
                    </select>
                  </label>
                  <div className="flex flex-col gap-2">
                    <button className="rounded-2xl bg-[var(--cxc-primary)] px-4 py-2 text-sm font-semibold text-white">
                      Set Up Grading Parameters
                    </button>
                    <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
                      Clear Parameters
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-slate-700">Levels</span>
                    <select className="rounded-2xl border border-[var(--cxc-border)] px-3 py-2 text-sm">
                      <option>CSEC ®</option>
                      <option>CAPE ®</option>
                    </select>
                  </label>
                  <div className="flex items-end">
                    <button
                      onClick={() => startGradingRun(() => setActiveScreenIndex(2))}
                      className="w-full rounded-2xl bg-[var(--cxc-accent)] px-4 py-2 text-sm font-semibold text-white"
                      style={{ background: "var(--cxc-primary)" }}
                    >
                      Run Grading
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-slate-700">Sessions</span>
                    <select className="rounded-2xl border border-[var(--cxc-border)] px-3 py-2 text-sm">
                      <option>JUNE 2025</option>
                      <option>JAN 2025</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-slate-700">Subjects</span>
                    <select
                      value={gradingSubject}
                      onChange={(e) => setGradingSubject(e.target.value)}
                      className="rounded-2xl border border-[var(--cxc-border)] px-3 py-2 text-sm"
                    >
                      <option>01207 BIOLOGY GENERAL</option>
                      <option>01218 ENGLISH A GENERAL</option>
                      <option>01204 MATHEMATICS GENERAL</option>
                    </select>
                  </label>
                  <div className="flex items-end gap-3">
                    <span className="mb-2 text-sm font-medium text-slate-700">Boundary Set</span>
                    <div className="mb-1.5 flex items-center overflow-hidden rounded-xl border border-[var(--cxc-border)]">
                      <button onClick={() => setGradingBoundarySet((v) => Math.max(1, v - 1))} className="px-3 py-2 text-slate-600 hover:bg-slate-100">−</button>
                      <span className="min-w-[2rem] text-center text-sm font-semibold">{gradingBoundarySet}</span>
                      <button onClick={() => setGradingBoundarySet((v) => v + 1)} className="px-3 py-2 text-slate-600 hover:bg-slate-100">+</button>
                    </div>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[var(--cxc-border)] bg-slate-50 p-4">
                  {([
                    ["clearExisting",    "Clear Existing Grades",    false             ],
                    ["calculateUngraded","Calculate UNGraded grades", calculateUngraded],
                    ["marksRecalc",      "Marks Recalculation",       false             ],
                    ["gradeAll",         "Grade All Candidates",      gradeAllCandidates],
                    ["writeToReprint",   "Write to Reprint",          writeToReprint    ],
                    ["checkDecisions",   "Check Decisions",           checkDecisions    ],
                    ["review",           "Review",                    false             ],
                    ["readCandidates",   "Read Candidates",           false             ],
                  ] as [string, string, boolean][]).map(([key, label, checked]) => (
                    <label key={key} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          if (key === "calculateUngraded") setCalculateUngraded((v) => !v);
                          if (key === "gradeAll")          setGradeAllCandidates((v) => !v);
                          if (key === "writeToReprint")    setWriteToReprint((v) => !v);
                          if (key === "checkDecisions")    setCheckDecisions((v) => !v);
                        }}
                        className="accent-[var(--cxc-primary)]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Grading Style */}
              <div className="rounded-2xl border border-[var(--cxc-border)] bg-slate-50 p-4">
                <div className="mb-3 text-sm font-semibold text-slate-700">Grading Style</div>
                <div className="space-y-2.5">
                  {(["Normal", "Music", "Typewriting", "Visual Arts"] as const).map((style) => (
                    <label key={style} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
                      <input
                        type="radio"
                        name="gradingStyle"
                        checked={gradingStyle === style}
                        onChange={() => setGradingStyle(style)}
                        className="accent-[var(--cxc-primary)]"
                      />
                      {style}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6">
              <div className="flex gap-0 border-b border-[var(--cxc-border)]">
                {([["details", "Profile Details"], ["selection", "Center / Candidate Selection"]] as const).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setProfileGradingTab(key)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      profileGradingTab === key
                        ? "border-b-2 border-[var(--cxc-primary)] text-[var(--cxc-primary)]"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {profileGradingTab === "details" ? (
                <div className="mt-4 space-y-4">
                  <div className="overflow-hidden rounded-2xl border border-[var(--cxc-border)]">
                    <div className="grid grid-cols-[60px_1fr_130px_150px] bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                      <div>Seq</div>
                      <div>Profile</div>
                      <div>Boundary Set</div>
                      <div>Standard Error</div>
                    </div>
                    {gradingProfiles.map((row, idx) => (
                      <div key={idx} className={`grid grid-cols-[60px_1fr_130px_150px] items-center px-4 py-3 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                        <div className="text-sm text-slate-500">{row.seq}</div>
                        <div className="font-medium text-slate-800">{row.profile}</div>
                        <div className="text-sm">{row.boundarySet}</div>
                        <div className="text-sm">{row.stdError}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">Edit</button>
                    <button className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-400" disabled>Apply</button>
                    <button className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-400" disabled>Cancel</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[["Boundary Set", gradingBoundarySet], ["Standard Error", 2]].map(([label, val]) => (
                      <div key={label as string}>
                        <div className="mb-1.5 text-sm font-medium text-slate-700">{label}</div>
                        <div className="flex w-fit items-center overflow-hidden rounded-xl border border-[var(--cxc-border)]">
                          <button className="px-3 py-1.5 text-slate-600 hover:bg-slate-100">−</button>
                          <span className="min-w-[2rem] text-center text-sm font-semibold">{val}</span>
                          <button className="px-3 py-1.5 text-slate-600 hover:bg-slate-100">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <div className="overflow-hidden rounded-2xl border border-[var(--cxc-border)]">
                    <div className="grid grid-cols-[40px_110px_1fr_90px_120px_130px] bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                      <div></div>
                      <div>Centre Code</div>
                      <div>Centre Name</div>
                      <div>Wildcard</div>
                      <div>Start Cand.</div>
                      <div>End Cand.</div>
                    </div>
                    {centreList.map((centre, idx) => (
                      <div key={centre.code} className={`grid grid-cols-[40px_110px_1fr_90px_120px_130px] items-center px-4 py-2.5 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                        <input type="checkbox" className="accent-[var(--cxc-primary)]" />
                        <div className="text-sm font-medium text-[var(--cxc-primary)]">{centre.code}</div>
                        <div className="truncate text-sm text-slate-700">{centre.name}</div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">Edit</button>
                    <button className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-400" disabled>Apply</button>
                    <button className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-400" disabled>Cancel</button>
                    <button className="ml-auto rounded-2xl bg-[var(--cxc-primary)] px-3 py-2 text-sm font-semibold text-white">Select All</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {["Wildcard", "Start Candidate", "End Candidate"].map((label) => (
                      <label key={label} className="grid gap-1.5">
                        <span className="text-xs text-slate-500">{label}</span>
                        <input className="rounded-xl border border-[var(--cxc-border)] px-3 py-2 text-sm" />
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Panel>
        </div>
      );
    }

    // ── Screen 0: Trial Grading (default) ────────────────────────────────────
    const distribution = [52, 68, 94, 118, 96, 62, 34];
    const previousDistribution = [49, 72, 101, 110, 88, 59, 30];
    return (
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          {/* Parameters panel */}
          <Panel title="Trial Grading Parameters" subtitle={`Session: ${gradingSession} · Run #${trialRunCount}`}>
            <div className="space-y-4">
              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-slate-700">Level</span>
                <select
                  value={gradingLevel}
                  onChange={(e) => setGradingLevel(e.target.value)}
                  className="rounded-2xl border border-[var(--cxc-border)] px-3 py-2 text-sm"
                >
                  <option>CSEC ®</option>
                  <option>CAPE ®</option>
                </select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-slate-700">Session</span>
                <select
                  value={gradingSession}
                  onChange={(e) => setGradingSession(e.target.value)}
                  className="rounded-2xl border border-[var(--cxc-border)] px-3 py-2 text-sm"
                >
                  <option>JUNE 2025</option>
                  <option>JAN 2025</option>
                  <option>JUNE 2024</option>
                </select>
              </label>
              {/* Qual — stacked to prevent long option text from overflowing */}
              <div className="grid gap-3">
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium text-slate-700">Start Qual</span>
                  <select
                    value={gradingStartQual}
                    onChange={(e) => setGradingStartQual(e.target.value)}
                    className="w-full rounded-2xl border border-[var(--cxc-border)] px-3 py-2 text-sm"
                  >
                    <option>01207 - BIOLOGY GENERAL</option>
                    <option>01204 - MATHEMATICS GENERAL</option>
                    <option>01218 - ENGLISH A GENERAL</option>
                  </select>
                </label>
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium text-slate-700">End Qual</span>
                  <select
                    value={gradingEndQual}
                    onChange={(e) => setGradingEndQual(e.target.value)}
                    className="w-full rounded-2xl border border-[var(--cxc-border)] px-3 py-2 text-sm"
                  >
                    <option>01207 - BIOLOGY GENERAL</option>
                    <option>01204 - MATHEMATICS GENERAL</option>
                    <option>01218 - ENGLISH A GENERAL</option>
                  </select>
                </label>
              </div>
              {/* Fac Code — short values fit side-by-side */}
              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium text-slate-700">Start Fac. Code</span>
                  <select
                    value={gradingStartFac}
                    onChange={(e) => setGradingStartFac(e.target.value)}
                    className="rounded-2xl border border-[var(--cxc-border)] px-3 py-2 text-sm"
                  >
                    <option>{"<First>"}</option>
                  </select>
                </label>
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium text-slate-700">End Fac. Code</span>
                  <select
                    value={gradingEndFac}
                    onChange={(e) => setGradingEndFac(e.target.value)}
                    className="rounded-2xl border border-[var(--cxc-border)] px-3 py-2 text-sm"
                  >
                    <option>{"<Last>"}</option>
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium text-slate-700">Start District</span>
                  <select
                    value={gradingStartDistrict}
                    onChange={(e) => setGradingStartDistrict(e.target.value)}
                    className="rounded-2xl border border-[var(--cxc-border)] px-3 py-2 text-sm"
                  >
                    <option>{"<First>"}</option>
                  </select>
                </label>
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium text-slate-700">End District</span>
                  <select
                    value={gradingEndDistrict}
                    onChange={(e) => setGradingEndDistrict(e.target.value)}
                    className="rounded-2xl border border-[var(--cxc-border)] px-3 py-2 text-sm"
                  >
                    <option>{"<Last>"}</option>
                  </select>
                </label>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">Queue</button>
                <button className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">Save</button>
                <button className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">Previous</button>
                <button
                  onClick={() => startGradingRun(() => {
                    setTrialRunCount((v) => v + 1);
                    setPipelineLog((items) => [
                      `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}: Trial grading run #${trialRunCount + 1} completed for ${gradingStartQual}.`,
                      ...items,
                    ]);
                  })}
                  className="rounded-2xl bg-[var(--cxc-primary)] px-3 py-2 text-sm font-semibold text-white"
                >
                  Run Trial Grading
                </button>
              </div>
            </div>
          </Panel>

          {/* Distribution + boundaries panel */}
          <Panel
            title={`Grade Distribution — Trial Run ${trialRunCount}`}
            subtitle="Iterate until the distribution is satisfactory, then proceed to Run Grading."
            action={
              <button
                onClick={() => setShowPreviousYear((v) => !v)}
                className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
              >
                {showPreviousYear ? "Hide previous year" : "Show previous year"}
              </button>
            }
          >
            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-3xl bg-slate-50 p-4">
                <div className="flex h-52 items-end gap-3">
                  {distribution.map((height, index) => (
                    <div key={index} className="relative flex flex-1 items-end justify-center">
                      {showPreviousYear ? (
                        <div className="absolute bottom-0 w-10 rounded-t-2xl bg-slate-300/70" style={{ height: previousDistribution[index] * 1.2 }} />
                      ) : null}
                      <div className="relative w-10 rounded-t-2xl bg-[var(--cxc-primary)]" style={{ height: height * 1.2 }} />
                    </div>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {["I", "II", "III", "IV", "V", "VI", "VII"].map((grade) => (
                    <div key={grade}>{grade}</div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {boundaries.map((boundary, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-700">Boundary {index + 1}</span>
                      <span className="text-xs text-slate-500">{boundary}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={boundary}
                      onChange={(event) =>
                        setBoundaries((items) => items.map((item, itemIndex) => (itemIndex === index ? Number(event.target.value) : item)))
                      }
                      className="w-full accent-[var(--cxc-primary)]"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveScreenIndex(1)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Enter Grade Boundaries
              </button>
              <button
                onClick={() => setActiveScreenIndex(2)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                View Grade Statistics
              </button>
              <button
                onClick={() => setActiveScreenIndex(3)}
                className="rounded-2xl px-4 py-2 text-sm font-semibold text-white"
                style={{ background: "var(--cxc-primary-dark)" }}
              >
                Profile Grading
              </button>
            </div>
          </Panel>
        </div>
      </div>
    );
  }

  function renderReporting() {
    if (activeScreenIndex === 0) {
      const reportCategories = [
        {
          category: "Registration Reports",
          color: "text-blue-700",
          bg: "bg-blue-50",
          border: "border-blue-200",
          reports: [
            { name: "Subject Registration Stats by Territory", desc: "Candidate counts per subject, broken down by territory" },
            { name: "School Comparison Report",                desc: "Registration volumes across schools and territories"  },
            { name: "Ministry Registration Summary",           desc: "Territory-level summary for ministry stakeholders"    },
            { name: "Payment Hold Report",                     desc: "Schools and candidates with outstanding hold status"  },
          ],
        },
        {
          category: "Grading Reports",
          color: "text-emerald-700",
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          reports: [
            { name: "Grade Distribution Summary", desc: "Grade I–VI count and percentage per subject"          },
            { name: "Committee Decision Summary", desc: "Approved, pending, and rejected boundary decisions"   },
            { name: "Hardship Uplift Register",   desc: "Candidates reviewed for hardship uplift with outcome" },
          ],
        },
        {
          category: "Results Reports",
          color: "text-purple-700",
          bg: "bg-purple-50",
          border: "border-purple-200",
          reports: [
            { name: "Results Release Pack",           desc: "Full official results for distribution to territories" },
            { name: "Preliminary Results Pack",       desc: "Pre-release results pending committee sign-off"        },
            { name: "Candidate Grade Notification",   desc: "Individual candidate result slips and exports"         },
          ],
        },
      ];
      return (
        <Panel title="Report Library" subtitle="Reports are grouped by phase. Choose a report to open it in the builder.">
          <div className="space-y-6">
            {reportCategories.map((cat) => (
              <div key={cat.category}>
                <div className={`mb-3 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cat.color} ${cat.bg} ${cat.border}`}>
                  {cat.category}
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {cat.reports.map((report) => (
                    <button
                      key={report.name}
                      onClick={() => setActiveScreenIndex(1)}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left hover:border-[var(--cxc-primary)] hover:bg-blue-50"
                    >
                      <div className="font-semibold text-slate-800">{report.name}</div>
                      <div className="mt-1.5 text-sm text-slate-500">{report.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      );
    }
    if (activeScreenIndex === 2) {
      return renderSecondaryScreen("PDF Print Preview", "Print-accurate export preview for the selected report.", [
        "Shows the same table and chart structure that will appear in the PDF export.",
        "Uses a header, margins, and footer treatment consistent with the report pack requirement.",
        "Keeps print preview as its own screen state rather than merging it into the builder.",
      ]);
    }
    // ── Derived data (reactive to params) ────────────────────────────────────
    const terrScale = reportParams.territory === "Barbados" ? 0.17
      : reportParams.territory === "Jamaica" ? 0.29 : 1;
    const typeScale = reportParams.candidateType === "Private Candidates" ? 0.06 : 1;
    const scale = terrScale * typeScale;

    const gradeBase    = [4646, 5104, 4339, 2445,  355,  13];
    const gradePrev    = [3504, 4439, 5089, 3446,  603,   7];
    const gradeLabels  = ["I", "II", "III", "IV", "V", "VI"];
    const gradeColors  = ["#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa", "#f59e0b", "#ef4444"];

    const gradeData = gradeBase.map((c, i) => ({
      grade: gradeLabels[i],
      color: gradeColors[i],
      current: Math.round(c * scale),
      prev:    Math.round(gradePrev[i] * scale),
    }));

    const totalCandidates = gradeData.reduce((s, d) => s + d.current, 0);
    const passCount       = gradeData.slice(0, 3).reduce((s, d) => s + d.current, 0);
    const passRate        = totalCandidates > 0 ? Math.round((passCount / totalCandidates) * 100) : 0;
    const gradeIRate      = totalCandidates > 0
      ? ((gradeData[0].current / totalCandidates) * 100).toFixed(1) : "0.0";
    const maxGrade        = Math.max(...gradeData.flatMap(d => [d.current, d.prev]), 1);

    const allTerritories = [
      { name: "Jamaica",   count: Math.round(12482 * typeScale) },
      { name: "Trinidad",  count: Math.round( 9841 * typeScale) },
      { name: "Barbados",  count: Math.round( 7204 * typeScale) },
      { name: "Guyana",    count: Math.round( 5302 * typeScale) },
      { name: "Belize",    count: Math.round( 3124 * typeScale) },
      { name: "Others",    count: Math.round( 4665 * typeScale) },
    ];
    const displayTerr = reportParams.territory === "All Territories"
      ? allTerritories
      : allTerritories.filter(t => t.name === reportParams.territory);
    const maxTerrCount = Math.max(...displayTerr.map(d => d.count), 1);

    const trendPoints = [
      { year: "2022", rate: 74 }, { year: "2023", rate: 78 },
      { year: "2024", rate: 82 }, { year: "2025", rate: 85 },
      { year: "2026", rate: 86 },
    ];
    const tW = 240; const tH = 110;
    const tPad = 32; const tPadB = 22;
    const tInnerW = tW - tPad - 10;
    const tInnerH = tH - tPadB - 12;
    const tMin = 60; const tMax = 100;
    const tPts = trendPoints.map((d, i) => ({
      ...d,
      x: tPad + (i / (trendPoints.length - 1)) * tInnerW,
      y: (tH - tPadB) - ((d.rate - tMin) / (tMax - tMin)) * tInnerH,
    }));
    const tPolyline = tPts.map(p => `${p.x},${p.y}`).join(" ");
    const tAreaPoly = `${tPts[0].x},${tH - tPadB} ${tPolyline} ${tPts[tPts.length - 1].x},${tH - tPadB}`;

    return (
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">

        {/* ── Parameters ───────────────────────────────────────────────────── */}
        <Panel title="Report Parameters" subtitle="Changes update the preview live.">
          <div className="space-y-3">
            {([
              ["Exam Year",      "year",          ["2026", "2025"]],
              ["Territory",      "territory",     ["All Territories", "Barbados", "Jamaica"]],
              ["Subject",        "subject",       ["CSEC Mathematics", "CSEC English A", "CSEC Biology"]],
              ["Candidate Type", "candidateType", ["All Candidates", "School Candidates", "Private Candidates"]],
              ["Output Format",  "format",        ["PDF", "Excel"]],
            ] as [string, string, string[]][]).map(([label, field, opts]) => (
              <label key={label} className="grid gap-1.5">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <select
                  value={reportParams[field as keyof typeof reportParams]}
                  onChange={(e) => setReportParams(c => ({ ...c, [field]: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </label>
            ))}
          </div>
          <button
            onClick={() => setActiveScreenIndex(2)}
            className="mt-4 w-full rounded-xl bg-[var(--cxc-primary)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Run Export
          </button>
        </Panel>

        {/* ── Live preview ─────────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Summary stats row */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Total Candidates", value: totalCandidates.toLocaleString() },
              { label: "Pass Rate",        value: `${passRate}%`                   },
              { label: "Grade I Rate",     value: `${gradeIRate}%`                 },
              { label: "Mean Score",       value: "71.2"                           },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border border-[var(--cxc-border)] bg-white px-4 py-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</div>
                <div className="mt-1 text-2xl font-bold text-[var(--cxc-heading)]">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Grade Distribution bar chart */}
          <Panel
            title="Grade Distribution"
            subtitle={`${reportParams.subject} · ${reportParams.territory} · ${reportParams.year}`}
            action={
              <button
                onClick={() => setShowPreviousYear(v => !v)}
                className="rounded-xl border border-[var(--cxc-border)] px-3 py-1.5 text-xs font-semibold text-slate-600"
              >
                {showPreviousYear ? "Hide prev. year" : "Compare prev. year"}
              </button>
            }
          >
            <div className="space-y-3">
              {/* Legend */}
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-8 rounded bg-[#2563eb]" />
                  <span>{reportParams.year}</span>
                </div>
                {showPreviousYear && (
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-8 rounded bg-slate-300" />
                    <span>{String(Number(reportParams.year) - 1)}</span>
                  </div>
                )}
              </div>

              {/* Bars */}
              <div className="flex items-end gap-2 px-1" style={{ height: 160 }}>
                {gradeData.map((d) => {
                  const currPct = (d.current / maxGrade) * 100;
                  const prevPct = (d.prev    / maxGrade) * 100;
                  const totalPct = totalCandidates > 0
                    ? ((d.current / totalCandidates) * 100).toFixed(1) : "0.0";
                  return (
                    <div key={d.grade} className="flex flex-1 flex-col items-center gap-0.5">
                      {/* Count + pct label */}
                      <div className="text-center">
                        <div className="text-xs font-bold text-slate-700 leading-none">
                          {d.current >= 1000 ? `${(d.current / 1000).toFixed(1)}k` : d.current}
                        </div>
                        <div className="text-[10px] text-slate-400 leading-none mt-0.5">{totalPct}%</div>
                      </div>
                      {/* Bar container */}
                      <div className="relative flex w-full items-end justify-center" style={{ height: 104 }}>
                        {/* Previous year bar — wide, light */}
                        {showPreviousYear && (
                          <div
                            className="absolute bottom-0 w-full rounded-t-lg bg-slate-200 transition-all duration-500"
                            style={{ height: `${prevPct}%` }}
                          />
                        )}
                        {/* Current year bar — narrower, coloured */}
                        <div
                          className="absolute bottom-0 w-3/4 rounded-t-lg transition-all duration-500"
                          style={{ height: `${currPct}%`, background: d.color }}
                        />
                      </div>
                      {/* Grade label */}
                      <div className="text-center text-xs font-semibold text-slate-600 leading-none mt-1">
                        Grade {d.grade}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Panel>

          {/* Territory breakdown + Trend row */}
          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">

            {/* Territory horizontal bars */}
            <Panel title="Registration by Territory" subtitle="Candidate volume breakdown for selected parameters.">
              <div className="space-y-3">
                {displayTerr.map(t => {
                  const barPct = Math.round((t.count / maxTerrCount) * 100);
                  return (
                    <div key={t.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{t.name}</span>
                        <span className="tabular-nums text-slate-500">{t.count.toLocaleString()}</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${barPct}%`, background: "var(--cxc-primary)" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>

            {/* Year-on-year pass rate trend (SVG line) */}
            <Panel title="Pass Rate Trend" subtitle="Grades I–III as % of total, per cycle.">
              <svg viewBox={`0 0 ${tW} ${tH}`} className="w-full" style={{ maxHeight: 140 }}>
                {/* Gridlines */}
                {[70, 80, 90, 100].map(r => {
                  const y = (tH - tPadB) - ((r - tMin) / (tMax - tMin)) * tInnerH;
                  return (
                    <g key={r}>
                      <line x1={tPad} x2={tW - 10} y1={y} y2={y}
                        stroke="#e2e8f0" strokeWidth="1" />
                      <text x={tPad - 5} y={y + 3.5} textAnchor="end"
                        fill="#94a3b8" fontSize="9">{r}%</text>
                    </g>
                  );
                })}
                {/* Area fill */}
                <polygon points={tAreaPoly}
                  fill="var(--cxc-primary)" opacity="0.08" />
                {/* Line */}
                <polyline points={tPolyline}
                  fill="none" stroke="var(--cxc-primary)"
                  strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                {/* Points + labels */}
                {tPts.map(p => (
                  <g key={p.year}>
                    <circle cx={p.x} cy={p.y} r="4.5"
                      fill="white" stroke="var(--cxc-primary)" strokeWidth="2.5" />
                    <text x={p.x} y={p.y - 9} textAnchor="middle"
                      fill="#374151" fontSize="9.5" fontWeight="600">{p.rate}%</text>
                    <text x={p.x} y={tH - 6} textAnchor="middle"
                      fill="#64748b" fontSize="9">{p.year}</text>
                  </g>
                ))}
              </svg>
            </Panel>

          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Last 5 exports retained in history.</span>
            <span>·</span>
            <span>Scheduled delivery uses the selected format.</span>
          </div>
        </div>
      </div>
    );
  }

  function renderTeacherPortal() {
    if (activeScreenIndex === 1) {
      const selectedStudent = teacherStudents.find((student) => student.id === selectedTeacherStudent) ?? teacherStudents[0];
      return (
        <Panel title={`Score Entry / ${selectedStudent.name}`} subtitle="Single-candidate editing view.">
          <div className="grid gap-4 xl:max-w-xl">
            {[
              ["Project", "project"],
              ["Lab Reports", "lab"],
              ["Test", "test"],
            ].map(([label, field]) => (
              <label key={label} className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <input
                  type="number"
                  value={selectedStudent[field as "project" | "lab" | "test"]}
                  onChange={(event) => updateTeacherScore(selectedStudent.id, field as "project" | "lab" | "test", Number(event.target.value))}
                  className="rounded-2xl border border-slate-200 px-4 py-3"
                />
              </label>
            ))}
            <button onClick={() => togglePortfolio(selectedStudent.id)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              {selectedStudent.portfolioUploaded ? "Mark portfolio pending" : "Mark portfolio uploaded"}
            </button>
            {selectedStudent.carryForwardEligible ? (
              <button onClick={() => applyCarryForward(selectedStudent.id)} className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                Apply carry-forward marks
              </button>
            ) : null}
          </div>
        </Panel>
      );
    }
    if (activeScreenIndex === 2) {
      return renderSecondaryScreen("Mobile Today", "Single-column mobile landing for pending teacher actions.", [
        "Displays cards such as students needing project scores and pending portfolio uploads.",
        "Supports drill-in behaviour to classes and candidate score entry.",
        "Keeps the responsive teacher workflow represented in the app structure.",
      ]);
    }
    if (activeScreenIndex === 3) {
      return renderSecondaryScreen("Mobile Score Entry", "Per-candidate score entry for phone-first SBA workflows.", [
        "Shows components vertically with compact number inputs.",
        "Includes portfolio upload and auto-save guidance.",
        "Supports next and previous candidate movement as a dedicated mobile screen state.",
      ]);
    }
    const selectedStudent = teacherStudents.find((student) => student.id === selectedTeacherStudent) ?? teacherStudents[0];
    return (
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Panel
            title="My Class"
            subtitle={`${teacherCompletion}/${teacherStudents.length} candidates complete`}
            action={
              <button
                disabled={!teacherReadyToSubmit}
                className="rounded-2xl bg-[var(--cxc-primary)] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300"
              >
                Submit to CXC
              </button>
            }
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    {["Candidate", "Project", "Lab", "Test", "Portfolio", "Carry Forward"].map((heading) => (
                      <th key={heading} className="px-4 py-3">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teacherStudents.map((student, index) => (
                    <tr key={student.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/70"}>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedTeacherStudent(student.id);
                            setActiveScreenIndex(1);
                          }}
                          className="font-medium text-[var(--cxc-primary)]"
                        >
                          {student.name}
                        </button>
                      </td>
                      <td className="px-4 py-3">{student.project || "-"}</td>
                      <td className="px-4 py-3">{student.lab || "-"}</td>
                      <td className="px-4 py-3">{student.test}</td>
                      <td className="px-4 py-3">{student.portfolioUploaded ? "Uploaded" : "Pending"}</td>
                      <td className="px-4 py-3">{student.carryForwardEligible ? "Eligible" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <Panel title={`Class Summary`} subtitle="Choose a student from the roster to edit scores.">
          <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
            Pending portfolios: {teacherStudents.filter((student) => !student.portfolioUploaded).length}
            <br />
            Carry-forward eligible: {teacherStudents.filter((student) => student.carryForwardEligible).length}
            <br />
            Auto-save is enabled for score entry.
          </div>
        </Panel>
      </div>
    );
  }

  function renderBilling() {
    if (activeScreenIndex === 1) {
      return (
        <Panel
          title={selectedInvoice.id}
          subtitle="Invoice detail"
          action={<StatusBadge status={selectedInvoice.hold ? "Result Hold Active" : "No Hold"} />}
        >
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-700">{selectedInvoice.entity}</div>
              <div className="mt-1 text-sm text-slate-500">{selectedInvoice.territory}</div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Amount</div>
                <div className="mt-2 text-xl font-bold text-slate-900">{currency(selectedInvoice.amount)}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Paid</div>
                <div className="mt-2 text-xl font-bold text-slate-900">{currency(selectedInvoice.paid)}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Balance</div>
                <div className="mt-2 text-xl font-bold text-slate-900">{currency(selectedInvoice.amount - selectedInvoice.paid)}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={recordPayment} className="rounded-2xl bg-[var(--cxc-primary)] px-4 py-2 text-sm font-semibold text-white">Record manual payment</button>
              <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Send reminder</button>
              <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Print invoice</button>
            </div>
          </div>
        </Panel>
      );
    }
    if (activeScreenIndex === 2) {
      return renderSecondaryScreen("Private Candidate Invoice", "Public-facing invoice view for individual candidates.", [
        "Presents a cleaner itemised invoice layout with pay-now emphasis.",
        "Keeps payment action, receipt download, and history together for the candidate audience.",
        "Separated from the finance dashboard to match the prompt's audience split.",
      ]);
    }
    return (
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Invoices" subtitle="Select an invoice to inspect actions and hold status.">
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <button
                key={invoice.id}
                onClick={() => {
                  setSelectedInvoiceId(invoice.id);
                  setActiveScreenIndex(1);
                }}
                className={`w-full rounded-2xl border px-4 py-4 text-left ${selectedInvoiceId === invoice.id ? "border-[var(--cxc-primary)] bg-blue-50" : "border-slate-200 bg-white"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">{invoice.id}</div>
                    <div className="text-sm text-slate-500">{invoice.entity}</div>
                  </div>
                  <StatusBadge status={invoice.status} />
                </div>
                <div className="mt-3 grid gap-2 text-sm text-slate-500 md:grid-cols-3">
                  <span>{invoice.territory}</span>
                  <span>{currency(invoice.amount)}</span>
                  <span>{currency(invoice.amount - invoice.paid)} balance</span>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Invoice Detail" subtitle="Open an invoice from the list to inspect it.">
          <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
            This panel behaves like the right-side invoice drawer from the design, but inside the main app content area.
          </div>
        </Panel>
      </div>
    );
  }

  function renderAdminConsole() {
    if (activeScreenIndex === 1) {
      return (
        <Panel title="Registration Period Configuration" subtitle="Cycle and territory overrides.">
          <div className="grid gap-4">
            <div className="rounded-2xl border border-[var(--cxc-border)] bg-[var(--cxc-page)] px-4 py-4 text-sm text-[var(--cxc-muted)]">
              Territory override controls can extend or narrow cycle windows without altering the global default timeline.
            </div>
            {Object.entries(regWindow).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between rounded-2xl border border-[var(--cxc-border)] px-4 py-3">
                <span className="text-sm font-medium capitalize text-[var(--cxc-ink)]">{key.replace(/([A-Z])/g, " $1")}</span>
                <span className="text-sm text-[var(--cxc-muted)]">{value}</span>
              </div>
            ))}
          </div>
        </Panel>
      );
    }
    if (activeScreenIndex === 2) {
      return (
        <Panel title="User Management" subtitle="Role-aware user administration.">
          <div className="space-y-3">
            {[
              ["M. Grant", "School Admin", "Jamaica"],
              ["R. Philip", "Local Registrar", "Barbados"],
              ["A. James", "Teacher", "Trinidad"],
            ].map(([name, role, territory]) => (
              <div key={name} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <div>
                  <div className="font-medium text-slate-700">{name}</div>
                  <div className="text-sm text-slate-500">{role} • {territory}</div>
                </div>
                <button className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">Manage</button>
              </div>
            ))}
          </div>
        </Panel>
      );
    }
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Registrations YTD" value="42,618" detail="Current exam cycle" icon={<Users className="size-4" />} />
          <StatCard label="Schools Active" value="711" detail="Across all territories" icon={<Building2 className="size-4" />} />
          <StatCard label="Territories Active" value="16" detail="With live registration windows" icon={<BarChart3 className="size-4" />} />
          <StatCard label="Payment Compliance" value="84%" detail="Improved from last cycle" icon={<Wallet className="size-4" />} />
        </div>
        <Panel title="Key Dates Timeline" subtitle="Operational milestones for the current cycle.">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              "Registration opens 1 June 2026",
              "Registration closes 31 July 2026",
              "Exam window begins 6 January 2027",
              "Results release planned for 14 August 2027",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-[var(--cxc-border)] bg-[var(--cxc-page)] px-4 py-4 text-sm text-[var(--cxc-muted)]">
                {item}
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Quick Actions" subtitle="High-frequency administration actions.">
          <div className="space-y-3">
            {["Open registration window", "Publish fee schedule", "Generate ministry report"].map((action) => (
              <div key={action} className="flex items-center justify-between rounded-2xl border border-[var(--cxc-border)] px-4 py-3">
                <span className="text-sm font-medium text-[var(--cxc-ink)]">{action}</span>
                <ChevronRight className="size-4 text-[var(--cxc-primary)]" />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    );
  }

  function renderRegistrar() {
    if (activeScreenIndex === 1) {
      return (
        <Panel title={selectedRegistrarCandidate.name} subtitle="Review details and record a decision.">
          <div className="grid gap-4">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              Subjects: {selectedRegistrarCandidate.subjects.join(", ")}<br />
              ID uploaded: {selectedRegistrarCandidate.idUploaded ? "Yes" : "No"}<br />
              Age check: {selectedRegistrarCandidate.ageCheck}
            </div>
            <textarea
              value={registrarComment}
              onChange={(event) => setRegistrarComment(event.target.value)}
              rows={4}
              placeholder="Decision comment"
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
            <div className="flex flex-wrap gap-3">
              <button onClick={() => updateRegistrarDecision("Approved")} className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                Approve
              </button>
              <button onClick={() => updateRegistrarDecision("Rejected")} className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white">
                Reject
              </button>
              <button onClick={() => updateRegistrarDecision("Info Requested")} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                Request More Info
              </button>
            </div>
          </div>
        </Panel>
      );
    }
    if (activeScreenIndex === 2) {
      return renderSecondaryScreen("Ministry Dashboard", "Read-only executive snapshot for ministries and territory stakeholders.", [
        "Summarises registrations by subject, school, and candidate type.",
        "Keeps export-focused read-only styling separate from approval operations.",
        "Reflects the prompt's ministry audience requirement as its own screen state.",
      ]);
    }
    return (
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel title="Approval Queue" subtitle="Select a candidate to review and decide.">
          <div className="space-y-3">
            {registrarCandidates.map((candidate) => (
              <button
                key={candidate.id}
                onClick={() => {
                  setSelectedRegistrarId(candidate.id);
                  setActiveScreenIndex(1);
                }}
                className={`w-full rounded-2xl border px-4 py-4 text-left ${candidate.id === selectedRegistrarId ? "border-[var(--cxc-primary)] bg-blue-50" : "border-slate-200 bg-white"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">{candidate.name}</div>
                    <div className="text-sm text-slate-500">{candidate.ucn}</div>
                  </div>
                  <StatusBadge status={candidate.status} />
                </div>
              </button>
            ))}
          </div>
        </Panel>
        <Panel title="Candidate Review" subtitle="Open a candidate from the queue to review details.">
          <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
            The queue opens into a dedicated review state rather than showing both screens at once.
          </div>
        </Panel>
      </div>
    );
  }

  function renderModulePlaceholder(
    title: string,
    description: string,
    features: string[],
  ) {
    return (
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Panel title={title} subtitle={description}>
          <div className="grid gap-3">
            {features.map((feature) => (
              <div key={feature} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                {feature}
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Next Expansion Path" subtitle="This module is wired into the app shell and ready for deeper flow implementation.">
          <div className="space-y-3 text-sm text-slate-500">
            <p>The app is now navigable and stateful, so these modules can evolve route by route without redesigning the shell again.</p>
            <p>Use the sidebar to move between modules and the core workflows to validate the overall interaction model.</p>
          </div>
        </Panel>
      </div>
    );
  }

  function renderCurrentModule() {
    switch (activeModule) {
      case "dashboard":
        return renderDashboard();
      case "subject-management":
        return renderSubjectManagement();
      case "scoring":
        return renderScoring();
      case "grading":
        return renderGrading();
      case "reporting":
        return renderReporting();
      case "teacher-portal":
        return renderTeacherPortal();
      case "billing":
        return renderBilling();
      case "admin-console":
        return renderAdminConsole();
      case "registrar":
        return renderRegistrar();
      case "centre-management":
        return renderModulePlaceholder("Centre Management", "Directory, assignments, and capacity planning.", [
          activeScreenIndex === 0
            ? "Map-to-table toggle for territories and centres"
            : activeScreenIndex === 1
              ? "Editable centre profile, rooms, and subject-offering detail"
              : activeScreenIndex === 2
                ? "Candidate assignment with auto-assign rules"
                : "Script requirement planning and export preparation",
          activeScreenIndex === 0
            ? "Directory view groups centres by territory and operational status"
            : activeScreenIndex === 1
              ? "Profile, capacity, and supervisor settings stay grouped by tab"
              : activeScreenIndex === 2
                ? "Assignment workflow balances unassigned candidates against remaining capacity"
                : "Print quantities include subject-by-centre spare allowances",
          "This module remains lighter than the M2 core flows but its screen structure now matches the mega prompt.",
        ]);
      case "pattern-library":
        return renderModulePlaceholder("Pattern Library", "Canonical visual reference for all EPS teams.", [
          "Colour, typography, spacing, and button standards",
          "Reusable examples for forms, cards, tables, and charts",
          "Acts as the in-app visual source of truth",
        ]);
      case "self-registration":
        return renderModulePlaceholder("Private Candidate Self Registration", "Multi-step registration with save-and-continue-later.", [
          activeScreenIndex === 0
            ? "Welcome screen with trust signals and account entry"
            : activeScreenIndex === 1
              ? "Desktop subject selection with searchable catalogue and fee total"
              : activeScreenIndex === 2
                ? "Mobile subject selection with stacked cards and sticky footer"
                : "Review, payment, and document-ready final submission stage",
          "Each screen state is represented so the module matches the four-screen prompt.",
          "The static app stays navigable without introducing backend registration logic.",
        ]);
      case "emis":
        return renderModulePlaceholder("EMIS Integration Console", "Territory sync monitoring and field mapping.", [
          "Connection health dashboard",
          "Sync history and retry controls",
          "Field mapping visibility for integration teams",
        ]);
      case "hei":
        return renderModulePlaceholder("HEI Results Transfer", "Authorised access for higher education institutions.", [
          "Search by UCN or candidate details",
          "Candidate-managed authorisation list",
          "Lookup history and audit visibility",
        ]);
      case "payment-gateway":
        return renderModulePlaceholder("Payment Gateway", "Candidate checkout and finance reconciliation.", [
          "Checkout form and payment method selection",
          "Success and receipt state",
          "Reconciliation workspace for finance staff",
        ]);
      case "migration":
        return renderModulePlaceholder("Legacy EPS Migration Console", "Historic data migration with validation and retries.", [
          "Entity-by-entity migration progress",
          "Validation rule outcomes",
          "Failure inspection and bulk retry tools",
        ]);
      default:
        return renderDashboard();
    }
  }

  const activeNav = navItems.find((item) => item.key === activeModule) ?? navItems[0];

  // Show login screen when not authenticated
  if (!currentUser) return renderLogin();

  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ background: "var(--cxc-page)", fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header className="z-40 flex flex-shrink-0 items-center justify-between px-6 py-0 shadow-md" style={{ background: "var(--cxc-primary)", minHeight: "56px" }}>
        {/* Left: logo + name */}
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle */}
          <button onClick={() => setSidebarOpen((v) => !v)} className="mr-1 rounded-lg p-1.5 text-white/70 hover:bg-white/10 md:hidden">
            <Menu className="size-5" />
          </button>
          <div className="flex size-9 items-center justify-center rounded-full border border-white/25 bg-white/15">
            <GraduationCap className="size-4 text-white" />
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/55">CXC EPS</div>
            <div className="text-[13px] font-bold leading-tight text-white">CARIBBEAN EXAMINATIONS COUNCIL</div>
          </div>
        </div>

        {/* Right: nav links + bell + avatar */}
        <div className="flex items-center gap-1">
          <button className="hidden rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white md:block">
            Support
          </button>
          <button onClick={handleLogout} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white">
            <LogOut className="size-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
          <button className="ml-1 rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white">
            <Bell className="size-5" />
          </button>
          {/* Avatar */}
          <div className="ml-2 flex size-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white ring-2 ring-white/30">
            {currentUser.avatarInitials}
          </div>
        </div>
      </header>

      {/* ── Body: sidebar + content ──────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1">

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside
          className={`
            flex-shrink-0 overflow-y-auto transition-all duration-200
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            fixed inset-y-[56px] left-0 z-30 w-56
            md:static md:inset-auto md:translate-x-0
            ${sidebarCollapsed ? "md:w-14" : "md:w-52"}
          `}
          style={{ background: "var(--cxc-primary-dark)" }}
        >
          {/* Role badge */}
          <div className={`border-b border-white/10 px-4 py-3 ${sidebarCollapsed ? "md:px-2" : ""}`}>
            {!sidebarCollapsed && (
              <>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/45">Signed in as</div>
                <div className="mt-0.5 truncate text-sm font-semibold text-white">{currentUser.name}</div>
                <div className="mt-0.5 truncate text-xs text-white/55">{roleLabels[currentUser.role]}</div>
              </>
            )}
          </div>

          {/* Search */}
          {!sidebarCollapsed && (
            <div className="px-3 py-3">
              <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: "rgba(0,0,0,0.2)" }}>
                <Search className="size-3.5 flex-shrink-0 text-white/50" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search modules"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-white/50 hover:text-white">
                    <X className="size-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Nav items */}
          <nav className="space-y-0.5 px-2 py-1 pb-6">
            {filteredNav.map((item) => (
              <button
                key={item.key}
                onClick={() => { goTo(item.key); setSidebarOpen(false); }}
                title={sidebarCollapsed ? item.label : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  activeModule === item.key
                    ? "font-semibold text-white"
                    : "text-white/75 hover:text-white"
                }`}
                style={{
                  background: activeModule === item.key ? "var(--cxc-sidebar-active-bg)" : undefined,
                }}
                onMouseEnter={(e) => { if (activeModule !== item.key) (e.currentTarget as HTMLElement).style.background = "var(--cxc-sidebar-hover-bg)"; }}
                onMouseLeave={(e) => { if (activeModule !== item.key) (e.currentTarget as HTMLElement).style.background = ""; }}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Collapse toggle — desktop only */}
          <div className="hidden border-t border-white/10 px-2 py-2 md:block">
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="flex w-full items-center justify-center rounded-lg py-2 text-white/50 hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className={`size-4 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`} />
            </button>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

          {/* Sub-header: page title + screen tabs */}
          <div className="flex-shrink-0 border-b border-[var(--cxc-border)] bg-white px-6 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-[var(--cxc-heading)]">{activeNav.label}</h1>
                {currentUser.territory && (
                  <div className="mt-0.5 text-xs text-[var(--cxc-muted)]">{currentUser.territory} · {roleLabels[currentUser.role]}</div>
                )}
              </div>
              {/* Screen tabs */}
              {activeNav.screens.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {activeNav.screens.map((screen, index) => (
                    <button
                      key={screen}
                      onClick={() => setActiveScreenIndex(index)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                        activeScreenIndex === index
                          ? "text-white"
                          : "border border-[var(--cxc-border)] text-[var(--cxc-muted)] hover:border-[var(--cxc-primary)] hover:text-[var(--cxc-ink)]"
                      }`}
                      style={activeScreenIndex === index ? { background: "var(--cxc-primary)" } : undefined}
                    >
                      {screen}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto max-w-[1440px] space-y-6">
              {renderCurrentModule()}
            </div>
          </main>
          <GradingInProgressOverlay />
        </div>
      </div>

      {/* Demo indicator */}
      <div className="fixed bottom-3 right-3 z-50 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-700 shadow-sm">
        Demo data — resets on reload
      </div>
    </div>
  );
}

export default App;
