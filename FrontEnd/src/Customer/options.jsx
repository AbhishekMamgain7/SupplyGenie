import React from 'react';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from './container'
function Header() {
    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate('/Login');
    };

    return (
        <header className="header">
            <Container />
        </header>
    );
}

export default Header;