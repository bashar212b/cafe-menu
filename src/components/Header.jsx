import React from 'react';
import { Coffee, Instagram } from "lucide-react";

export default function Header({ cafeName }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="الصفحة الرئيسية">
        <span className="brand-mark"><Coffee size={20} /></span>
        <span>{cafeName}</span>
      </a>
      <span className="header-note">A LITTLE MOMENT, A LOT OF TASTE</span>
      <a className="social-link" href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={19} /></a>
    </header>
  );
}