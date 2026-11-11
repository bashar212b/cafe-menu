import React from 'react'; // أضف هذا السطر في الأعلى تماماً
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MenuPage from "./pages/MenuPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return <AuthProvider><Routes>
    <Route path="/" element={<MenuPage />} />
    <Route path="/admin/login" element={<LoginPage />} />
    <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
    <Route path="*" element={<MenuPage />} />
  </Routes></AuthProvider>;
}