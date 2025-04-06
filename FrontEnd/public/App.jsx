import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage.jsx";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import Manager from "./manager.jsx";
import Inventory from "./Inventory/Inventory.jsx";
import Warehouse from "./Inventory/warehouse.jsx";
import Dashboard from "./Inventory/Dashboard.jsx";
import Stocks from "./Stocks/Stocks.jsx";
import Chatbot from "./ChatBot/Chatbot.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        {/**/}
        <Route
          path="/"
          element={
            <>
              <Homepage />
              <Chatbot />
            </>
          }
        />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Manager" element={<Manager />} />
        <Route path="/Inventory/Inventory" element={<Inventory />} />
        <Route path="/Inventory/warehouse" element={<Warehouse />} />
        <Route path="/Inventory/Dashboard" element={<Dashboard />} />
        <Route path="/Stocks/Stocks" element={<Stocks />} />
      </Routes>
    </Router>
  );
};

export default App;
