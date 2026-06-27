import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Today from "./pages/Today";
import AllTasks from "./pages/AllTasks";
import NewTask from "./pages/NewTask";
import Upcoming from "./pages/Upcoming";
import Progress from "./pages/Progress";
import PageWrapper from "./components/PageWrapper";



function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "18px"
      }}>
        Loading session...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>

        {/* 🌍 PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔒 PROTECTED APP ROUTES */}
        <Route path="/today" element={<ProtectedRoute><PageWrapper><Today /></PageWrapper></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><PageWrapper><AllTasks /></PageWrapper></ProtectedRoute>} />
        <Route path="/new" element={<ProtectedRoute><PageWrapper><NewTask /></PageWrapper></ProtectedRoute>} />
        <Route path="/upcoming" element={<ProtectedRoute><PageWrapper><Upcoming /></PageWrapper></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><PageWrapper><Progress /></PageWrapper></ProtectedRoute>} />

      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
