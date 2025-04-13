import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./manager.css";
const Manager = () => {
  return (
    <div className="manager-page">
      <header className="header">
        <div className="header-title">SupplyGenie</div>
        <nav className="header-nav">
          <ul className="header-menu">
            <li className="header-menu-item">
              <Link to="/" className="header-link">
                Home
              </Link>
            </li>
            <li className="header-menu-item">
              <Link to="/Policies" className="header-link">
                Policies
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <motion.div
        type="button"
        name="inventory"
        placeholder="Inventory"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inventory"
      >
        <p className="options">
          <Link to="/Inventory/Inventory">Inventory</Link>
        </p>
      </motion.div>
      <motion.div
        type="button"
        name="stocks"
        placeholder="Stock"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="stocks"
      >
        <p className="options">
          <Link to="/Stocks/Stocks">Stocks</Link>
        </p>
      </motion.div>
    </div>
  );
};
export default Manager;
