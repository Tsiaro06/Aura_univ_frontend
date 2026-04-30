import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthProvider } from "@/hooks/useAuth";
import { RequireAuth } from "@/components/auth/RequireAuth";
import Landing from "./pages/Landing";
import Overview from "./pages/Overview";
import NotFound from "./pages/NotFound.tsx";
import AuthPage from "./pages/Auth";
import StudentsPage from "./pages/Students";
import CoursesPage from "./pages/Courses";
import EnrollmentPage from "./pages/Enrollment";
import GradesPage from "./pages/Grades";
import AttendancePage from "./pages/Attendance";
import ReportsPage from "./pages/Reports";
import SettingsPage from "./pages/Settings";

const queryClient = new QueryClient();

const protectedLayout = (page: React.ReactNode) => (
  <RequireAuth>
    <AppLayout>{page}</AppLayout>
  </RequireAuth>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={protectedLayout(<Overview />)} />
            <Route path="/students" element={protectedLayout(<StudentsPage />)} />
            <Route path="/courses" element={protectedLayout(<CoursesPage />)} />
            <Route path="/enrollment" element={protectedLayout(<EnrollmentPage />)} />
            <Route path="/grades" element={protectedLayout(<GradesPage />)} />
            <Route path="/attendance" element={protectedLayout(<AttendancePage />)} />
            <Route path="/reports" element={protectedLayout(<ReportsPage />)} />
            <Route path="/settings" element={protectedLayout(<SettingsPage />)} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
