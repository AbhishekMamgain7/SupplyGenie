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

      {/* About Us Section */}
      <section className="about-us">
        <h2>About Us</h2>
        <p>
          SupplyGenie is your smart warehouse assistant, helping you manage,
          monitor, and optimize your inventory operations with ease. Our mission
          is to empower businesses with seamless supply chain and warehouse
          management solutions.
        </p>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>Our Services</h2>
        <div className="service-cards">
          <div className="service-card">
            <h3>Real-Time Inventory Tracking</h3>
            <p>
              Track stock levels in real-time and prevent stockouts or
              overstocking with ease.
            </p>
          </div>
          <div className="service-card">
            <h3>Smart Alerts & Notifications</h3>
            <p>
              Get instant alerts for low stock, high demand, and reorder needs
              via SMS or Email.
            </p>
          </div>
          <div className="service-card">
            <h3>Dashboard Analytics</h3>
            <p>
              Visualize your warehouse data with insightful charts and
              performance indicators.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
