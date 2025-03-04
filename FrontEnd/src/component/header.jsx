import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import Link
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './Header.css'; 
import "bootstrap/dist/css/bootstrap.min.css"
const Header = () => {
  const navigate = useNavigate();
  const handleLoginClick = ()=>{ 
    navigate('/Login');
  };
  return (
    <header className="header">
      <h1 className="header-title">My Website</h1>
      <nav className="header-nav">
        <ul className="header-menu">
          <li className="header-menu-item">
            <a onClick={handleLoginClick} className="header-link">Login</a>{}
          </li>
          <li className="header-menu-item">
            <a href="#services" className="header-link">Services</a>
          </li>
          <li className="header-menu-item">
            <a href="#services" className="header-link">Privacy
            </a>
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
