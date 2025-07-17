import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { NotificationProvider } from './components/notifications/NotificationProvider';
import DueDateChecker from './components/notifications/DueDateChecker';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import NotFoundPage from './pages/notFoundPage';
import HomePage from './pages/HomePage';
import ProjectFormPage from './pages/ProjectFormPage';
import TaskFormPage from './pages/TaskFormPage';
import ProjectsDetailsPage from './pages/ProjectsDetailsPage';
import AuthDebug from './components/auth/AuthDebug';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <DueDateChecker />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects/new" element={<ProjectFormPage />} />
            <Route path="/projects/:projectId/edit" element={<ProjectFormPage />} />
            <Route path="/projects/:projectId" element={<ProjectsDetailsPage />} />
            <Route path="/projects/:projectId/tasks/new" element={<TaskFormPage />} />
            <Route path="/projects/:projectId/tasks/:taskId/edit" element={<TaskFormPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        <AuthDebug />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
