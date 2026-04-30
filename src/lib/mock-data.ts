export type Student = {
  id: string;
  name: string;
  email: string;
  major: string;
  year: 1 | 2 | 3 | 4;
  gpa: number;
  status: "Active" | "On Leave" | "Graduated";
  avatarColor: string;
  enrolledCourses: number;
  attendance: number; // percent
};

export type Course = {
  id: string;
  code: string;
  title: string;
  faculty: string;
  department: string;
  credits: number;
  enrolled: number;
  capacity: number;
  schedule: string;
  status: "Open" | "Full" | "Waitlist";
};

export type GradeRow = {
  studentId: string;
  studentName: string;
  assignment1: number;
  assignment2: number;
  midterm: number;
  final: number;
};

export type AttendanceRow = {
  studentId: string;
  studentName: string;
  // 14 sessions
  sessions: ("present" | "absent" | "late" | "excused")[];
};

const colors = [
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500",
  "from-cyan-400 to-sky-500",
];

const firstNames = ["Amelia", "Noah", "Sophia", "Liam", "Olivia", "Ethan", "Ava", "Mason", "Isabella", "Lucas", "Mia", "Logan", "Charlotte", "James", "Harper", "Elijah", "Evelyn", "Aiden", "Abigail", "Carter"];
const lastNames = ["Bennett", "Hayes", "Reyes", "Patel", "Nguyen", "Kim", "Müller", "Rossi", "Martín", "Okafor", "Yamamoto", "Singh", "Dubois", "Andersen", "Costa", "Tanaka", "Iverson", "Cohen", "Peters", "Walsh"];
const majors = ["Computer Science", "Mathematics", "Economics", "Physics", "Design", "Biology", "Philosophy", "Mechanical Eng."];

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const r = rng(7);

export const students: Student[] = Array.from({ length: 24 }).map((_, i) => {
  const name = `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`;
  const gpa = +(2.5 + r() * 1.5).toFixed(2);
  const att = Math.round(70 + r() * 30);
  return {
    id: `STU-${(1000 + i).toString()}`,
    name,
    email: `${name.toLowerCase().replace(/\s/g, ".")}@uni.edu`,
    major: majors[i % majors.length],
    year: ((i % 4) + 1) as 1 | 2 | 3 | 4,
    gpa,
    status: i % 11 === 0 ? "On Leave" : i % 17 === 0 ? "Graduated" : "Active",
    avatarColor: colors[i % colors.length],
    enrolledCourses: 3 + (i % 4),
    attendance: att,
  };
});

export const courses: Course[] = [
  { id: "C1", code: "CS 201", title: "Data Structures & Algorithms", faculty: "Dr. Elena Park", department: "Computer Science", credits: 4, enrolled: 42, capacity: 45, schedule: "Mon/Wed 10:00", status: "Open" },
  { id: "C2", code: "MATH 301", title: "Linear Algebra", faculty: "Prof. Henry Cole", department: "Mathematics", credits: 3, enrolled: 38, capacity: 40, schedule: "Tue/Thu 09:00", status: "Open" },
  { id: "C3", code: "ECON 210", title: "Microeconomics", faculty: "Dr. Maya Singh", department: "Economics", credits: 3, enrolled: 50, capacity: 50, schedule: "Mon/Wed 13:00", status: "Full" },
  { id: "C4", code: "PHYS 110", title: "Classical Mechanics", faculty: "Dr. Theo Ito", department: "Physics", credits: 4, enrolled: 28, capacity: 35, schedule: "Tue/Thu 11:00", status: "Open" },
  { id: "C5", code: "DSGN 150", title: "Visual Design Foundations", faculty: "Prof. Lina Costa", department: "Design", credits: 3, enrolled: 24, capacity: 24, schedule: "Fri 10:00", status: "Waitlist" },
  { id: "C6", code: "BIO 220", title: "Molecular Biology", faculty: "Dr. Rafael Ortiz", department: "Biology", credits: 4, enrolled: 33, capacity: 40, schedule: "Mon/Wed 15:00", status: "Open" },
  { id: "C7", code: "PHIL 101", title: "Intro to Philosophy", faculty: "Prof. Aiko Tanaka", department: "Philosophy", credits: 3, enrolled: 60, capacity: 80, schedule: "Tue/Thu 14:00", status: "Open" },
  { id: "C8", code: "ME 305", title: "Thermodynamics", faculty: "Dr. Owen Walsh", department: "Mechanical Eng.", credits: 4, enrolled: 31, capacity: 35, schedule: "Mon/Wed 08:00", status: "Open" },
];

export const enrollmentTrend = [
  { month: "Jan", students: 1820 },
  { month: "Feb", students: 1880 },
  { month: "Mar", students: 1940 },
  { month: "Apr", students: 2010 },
  { month: "May", students: 2060 },
  { month: "Jun", students: 2105 },
  { month: "Jul", students: 2160 },
  { month: "Aug", students: 2240 },
  { month: "Sep", students: 2412 },
];

export const departmentDistribution = [
  { name: "Computer Sci.", value: 412 },
  { name: "Engineering", value: 365 },
  { name: "Sciences", value: 298 },
  { name: "Humanities", value: 244 },
  { name: "Business", value: 318 },
  { name: "Design", value: 142 },
];

export const recentActivity = [
  { id: 1, who: "Dr. Elena Park", action: "submitted grades for CS 201 — Midterm", time: "2m ago", type: "grade" as const },
  { id: 2, who: "Sophia Reyes", action: "enrolled in MATH 301", time: "18m ago", type: "enroll" as const },
  { id: 3, who: "Registrar", action: "opened Spring 2026 enrollment window", time: "1h ago", type: "system" as const },
  { id: 4, who: "Prof. Lina Costa", action: "marked attendance for DSGN 150", time: "3h ago", type: "attendance" as const },
  { id: 5, who: "Noah Patel", action: "requested official transcript", time: "5h ago", type: "request" as const },
];

export const gradeRows: GradeRow[] = students.slice(0, 10).map((s, i) => ({
  studentId: s.id,
  studentName: s.name,
  assignment1: 70 + ((i * 7) % 30),
  assignment2: 65 + ((i * 11) % 33),
  midterm: 60 + ((i * 13) % 38),
  final: 68 + ((i * 17) % 30),
}));

const attStates: AttendanceRow["sessions"][number][] = ["present", "absent", "late", "excused"];
export const attendanceRows: AttendanceRow[] = students.slice(0, 12).map((s, i) => ({
  studentId: s.id,
  studentName: s.name,
  sessions: Array.from({ length: 14 }).map((_, j) => {
    const x = (i * 3 + j * 5) % 17;
    if (x < 12) return "present";
    if (x === 12 || x === 13) return "late";
    if (x === 14) return "excused";
    return "absent";
  }),
}));
