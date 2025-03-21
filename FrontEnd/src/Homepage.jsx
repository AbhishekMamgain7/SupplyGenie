import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './component/header.jsx';
import Login from "./Login.jsx";
function App() {
  return (
    <Router>
    <Header />
    <Routes>
      <Route path="/Login" element={<Login />} />
    </Routes>
  </Router>
  );
}

export default App;
