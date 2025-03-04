import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './component/header.jsx';
import RenderLogin from "./Login.jsx";
function App() {
  return (
    <Router>
    <Header />
    <Routes>
      <Route path="/Login" element={<RenderLogin />} />
    </Routes>
  </Router>
  );
}

export default App;
