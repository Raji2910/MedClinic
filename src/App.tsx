import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Login } from "@/components/Login";
import { Calendar } from "@/components/Calendar";
import { AppointmentForm } from "@/components/AppointmentForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NotFound } from "./pages/NotFound";
import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

const App = () => {
  const { isAuthenticated } = useAuth();
  const { toasts, removeToast } = useToast();
  
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Navigate to="/calendar" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/calendar" 
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/appointment/new" 
            element={
              <ProtectedRoute>
                <AppointmentForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/appointment/edit" 
            element={
              <ProtectedRoute>
                <AppointmentForm />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </BrowserRouter>
  );
};

export default App;