import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Login } from "@/components/Login";
import { Calendar } from "@/components/Calendar";
import { AppointmentForm } from "@/components/AppointmentForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
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
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
