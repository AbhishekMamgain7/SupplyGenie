import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Login.jsx";
import Header from "./component/header.jsx";
function Back() {
  return (
    <div className="background-container">
      <div className="back"></div>
      <Router>
    <Header />
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  </Router>
    </div>
  );
}

export default Back;
