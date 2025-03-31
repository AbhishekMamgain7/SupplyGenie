import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="header-title">SupplyGenie</div>
      <nav className="header-nav">
        <ul className="header-menu">
          <li className="header-menu-item">
            <Link to="/Login" className="header-link">Login</Link>
          </li>
          <li className="header-menu-item">
            <Link to="/Policies" className="header-link">Policies</Link>
          </li>
          <li className="header-menu-item">
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
