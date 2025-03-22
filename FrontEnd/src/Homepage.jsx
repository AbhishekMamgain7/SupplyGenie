import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './component/header.jsx';
import Login from "./Login.jsx";
import SignUp from './SignUp.jsx';
function App() {
  return (
    <Router>
    <Header />
    <Routes>
      <Route path="/Login" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />}/>
    </Routes>
  </Router>
  );
}

export default App;
