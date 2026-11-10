import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* BrowserRouter يجعل التنقل بين الصفحات دون إعادة تحميل الموقع بالكامل */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);