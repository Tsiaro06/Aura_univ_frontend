import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ---------- Students ----------
export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("student_code", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

// ---------- Courses ----------
export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("code", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useCourseEnrollmentCounts() {
  return useQuery({
    queryKey: ["course-enrollment-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("course_id, status");
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data ?? []).forEach((row) => {
        if (row.status === "active") counts[row.course_id] = (counts[row.course_id] ?? 0) + 1;
      });
      return counts;
    },
  });
}

// ---------- Enrollments ----------
export function useEnrollmentsByCourse(courseId: string | undefined) {
  return useQuery({
    queryKey: ["enrollments", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const { data, error } = await supabase
        .from("enrollments")
        .select("student_id, status")
        .eq("course_id", courseId);
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
}

export function useToggleEnrollment(courseId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ studentId, currentlyEnrolled }: { studentId: string; currentlyEnrolled: boolean }) => {
      if (!courseId) throw new Error("No course selected");
      if (currentlyEnrolled) {
        const { error } = await supabase
          .from("enrollments")
          .delete()
          .eq("student_id", studentId)
          .eq("course_id", courseId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("enrollments")
          .insert({ student_id: studentId, course_id: courseId, status: "active" });
        if (error) throw error;
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["enrollments", courseId] });
      qc.invalidateQueries({ queryKey: ["course-enrollment-counts"] });
      toast.success(vars.currentlyEnrolled ? "Student unenrolled" : "Student enrolled");
    },
    onError: (e: Error) => toast.error(e.message ?? "Action failed"),
  });
}

// ---------- Grades ----------
export function useGradesByCourse(courseId: string | undefined) {
  return useQuery({
    queryKey: ["grades", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const { data, error } = await supabase
        .from("grades")
        .select("*, students(id, full_name, student_code)")
        .eq("course_id", courseId);
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
}

export function useUpdateGrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      id: string;
      field: "assignment1" | "assignment2" | "midterm" | "final_exam";
      value: number;
    }) => {
      const update: Record<string, number> = { [payload.field]: payload.value };
      const { error } = await supabase
        .from("grades")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .update(update as any)
        .eq("id", payload.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["grades"] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Save failed"),
  });
}

// ---------- Attendance ----------
export function useAttendanceByCourse(courseId: string | undefined) {
  return useQuery({
    queryKey: ["attendance", courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const { data, error } = await supabase
        .from("attendance")
        .select("*, students(id, full_name, student_code)")
        .eq("course_id", courseId)
        .order("session_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
}

export function useUpdateAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; status: "present" | "absent" | "late" | "excused" }) => {
      const { error } = await supabase
        .from("attendance")
        .update({ status: payload.status })
        .eq("id", payload.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Update failed"),
  });
}

// ---------- Overview metrics ----------
export function useOverviewStats() {
  return useQuery({
    queryKey: ["overview-stats"],
    queryFn: async () => {
      const [students, courses, attendance] = await Promise.all([
        supabase.from("students").select("id, gpa, status", { count: "exact" }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("attendance").select("status"),
      ]);

      if (students.error) throw students.error;
      if (courses.error) throw courses.error;
      if (attendance.error) throw attendance.error;

      const activeStudents = (students.data ?? []).filter((s) => s.status === "active").length;
      const gpas = (students.data ?? []).map((s) => Number(s.gpa)).filter((n) => !isNaN(n) && n > 0);
      const avgGpa = gpas.length ? gpas.reduce((a, b) => a + b, 0) / gpas.length : 0;

      const att = attendance.data ?? [];
      const presentLike = att.filter((r) => r.status === "present" || r.status === "excused").length;
      const attendanceRate = att.length ? (presentLike / att.length) * 100 : 0;

      return {
        totalStudents: students.count ?? 0,
        activeStudents,
        totalCourses: courses.count ?? 0,
        avgGpa,
        attendanceRate,
      };
    },
  });
}

// ---------- Department distribution ----------
export function useDepartmentDistribution() {
  return useQuery({
    queryKey: ["department-distribution"],
    queryFn: async () => {
      const { data, error } = await supabase.from("students").select("major");
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data ?? []).forEach((s) => {
        const k = s.major ?? "Unknown";
        counts[k] = (counts[k] ?? 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    },
  });
}
