import React from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";
const Homepage = () => {
  return (
    <div className="background-container">
      <div className="back"></div>
      <header className="header">
        <div className="header-title">SupplyGenie</div>
        <nav className="header-nav">
          <ul className="header-menu">
            <li className="header-menu-item">
              <Link to="/Login" className="header-link">
                Login
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
      {/* Add content for homepage */}
      <div className="homepage-content">
        <h1>Welcome to SupplyGenie</h1>
        <p>Manage your inventory efficiently and seamlessly.</p>
      </div>
    </div>
  );
};

export default Homepage;
