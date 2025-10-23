import { useState } from "react";
import { LandingPage } from "./components/landing-page";
import { RegisterPage } from "./components/register-page";
import { LoginPage } from "./components/login-page";
import { StudentDashboard } from "./components/student-dashboard";
import { StudentGuide } from "./components/student-guide";
import { StudentChat } from "./components/student-chat";
import { StudentMetrics } from "./components/student-metrics";
import { TeacherDashboard } from "./components/teacher-dashboard";
import { TeacherCreate } from "./components/teacher-create";
import { TeacherMetrics } from "./components/teacher-metrics";
import { TeacherUsers } from "./components/teacher-users";
import { AdminDashboard } from "./components/admin-dashboard";
import { AdminUsers } from "./components/admin-users";
import { TestLearningStyle } from "./components/test-learning-style";
import { Toaster } from "./components/ui/sonner";

type Page =
  | "home"
  | "register"
  | "login"
  | "student-dashboard"
  | "student-guide"
  | "student-chat"
  | "student-metrics"
  | "teacher-dashboard"
  | "teacher-create"
  | "teacher-metrics"
  | "teacher-users"
  | "admin-dashboard"
  | "admin-users"
  | "test-learning-style";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [userRole, setUserRole] = useState<string>("student");

  const handleNavigate = (page: string, role?: string) => {
    setCurrentPage(page as Page);
    if (role) {
      setUserRole(role);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <LandingPage onNavigate={handleNavigate} />;
      case "register":
        return <RegisterPage onNavigate={handleNavigate} />;
      case "login":
        return <LoginPage onNavigate={handleNavigate} />;
      case "student-dashboard":
        return <StudentDashboard onNavigate={handleNavigate} />;
      case "student-guide":
        return <StudentGuide onNavigate={handleNavigate} />;
      case "student-chat":
        return <StudentChat onNavigate={handleNavigate} />;
      case "student-metrics":
        return <StudentMetrics onNavigate={handleNavigate} />;
      case "teacher-dashboard":
        return <TeacherDashboard onNavigate={handleNavigate} />;
      case "teacher-create":
        return <TeacherCreate onNavigate={handleNavigate} />;
      case "teacher-metrics":
        return <TeacherMetrics onNavigate={handleNavigate} />;
      case "teacher-users":
        return <TeacherUsers onNavigate={handleNavigate} />;
      case "admin-dashboard":
        return <AdminDashboard onNavigate={handleNavigate} />;
      case "admin-users":
        return <AdminUsers onNavigate={handleNavigate} />;
      case "test-learning-style":
        return <TestLearningStyle />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {renderPage()}
      <Toaster />
    </>
  );
}
