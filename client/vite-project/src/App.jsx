import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import auth from "./pages/auth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<auth />} />
    </Routes>
  );
}

export default App;