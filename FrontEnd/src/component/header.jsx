import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
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
            <Link to="/Privacy" className="header-link">Policies</Link>
          </li>
          <li className="header-menu-item">
            <div className="header-search">
              <FontAwesomeIcon icon={faSearch} className="header-search-icon" />
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
