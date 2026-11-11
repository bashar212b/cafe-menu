import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// لا نعرض لوحة الإدارة إلا بعد التأكد من تسجيل الدخول.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="screen-loader">لحظة من فضلك...</div>;
  return user ? children : <Navigate to="/admin/login" replace />;
}