import React from 'react';
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { LockKeyhole, Coffee } from "lucide-react";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/admin" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/admin", { replace: true });
    } catch {
      setError("تعذّر تسجيل الدخول. تحقق من البريد وكلمة المرور ومن تفعيل Email/Password في Firebase.");
    } finally { setBusy(false); }
  }

  return <main className="login-screen"><div className="login-card">
    <div className="login-logo"><Coffee size={25} /></div><span className="eyebrow">NOIR CAFÉ · CONTROL PANEL</span>
    <h1>مرحباً بعودتك</h1><p>سجّل الدخول لإدارة قائمة الكافيه.</p>
    <form onSubmit={handleSubmit}>
      <label>البريد الإلكتروني<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="username" /></label>
      <label>كلمة المرور<input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" /></label>
      {error && <div className="form-error">{error}</div>}
      <button className="primary-button" disabled={busy}>{busy ? "جارٍ الدخول..." : <><LockKeyhole size={17} /> تسجيل الدخول</>}</button>
    </form>
    <a className="back-link" href="/">العودة إلى المنيو</a>
  </div></main>;
}