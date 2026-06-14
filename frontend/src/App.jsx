import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🌐 Public Pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// 🔐 Dashboards
import Dashboard from "./pages/dashboard/Dashboard";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

// 📁 Projects
import StudentProjects from "./pages/projects/StudentProjects";
import AdminProjects from "./pages/projects/AdminProjects";
import AdminUsers from "./pages/projects/AdminUsers";
import AdminReports from "./pages/projects/AdminReports";
import ProjectDetail from "./pages/projects/ProjectDetail";
import ProjectResults from "./pages/projects/ProjectResults";
import FileViewer from "./pages/projects/FileViewer";
// ✅ FIXED: only ONE correct import
import ProjectTasks from "./pages/projects/ProjectTasks";
import TaskDetail from "./pages/tasks/TaskDetail";

// 🔒 Protection
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= SMART DASHBOARD ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= STUDENT ================= */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/student/projects"
          element={
            <ProtectedRoute>
              <StudentProjects />
            </ProtectedRoute>
          }
        />

        {/* 🔥 PROJECT DETAIL */}
        <Route
          path="/dashboard/student/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />

        {/* 🔥 TASKS LIST */}
        <Route
          path="/dashboard/student/projects/:id/tasks"
          element={
            <ProtectedRoute>
              <ProjectTasks />
            </ProtectedRoute>
          }
        />

        {/* 🔥 TASK DETAIL */}
        <Route
          path="/dashboard/student/projects/:id/tasks/:taskId"
          element={
            <ProtectedRoute>
              <TaskDetail />
            </ProtectedRoute>
          }
        />

        {/* 🔥 RESULTS */}
        <Route
          path="/dashboard/student/projects/:id/results"
          element={
            <ProtectedRoute>
              <ProjectResults />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/student/projects/:id/file"
          element={
            <ProtectedRoute>
              <FileViewer />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin/projects"
          element={
            <ProtectedRoute>
              <AdminProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin/reports"
          element={
            <ProtectedRoute>
              <AdminReports />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;