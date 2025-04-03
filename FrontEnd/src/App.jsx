import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import Manager from "./manager.jsx";
import Header from "./component/header.jsx";
import Inventory from "./Inventory/Inventory.jsx";
import Warehouse from "./Inventory/warehouse.jsx";
import Stocks from "./Stocks/Stocks.jsx";
import "./Homepage.css";
const App = () => {
  return (
    <div className="background-container">
      <div className="back"></div>
      <Router>
        <Header />
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Manager" element={<Manager />} />
          <Route path="/Inventory/Inventory" element={<Inventory />}></Route>
          <Route path="/Inventory/warehouse" element={<Warehouse />}></Route>
          <Route path="/Stocks/Stocks" element={<Stocks />}></Route>
        </Routes>
      </Router>
    </div>
  );
};
export default App;
