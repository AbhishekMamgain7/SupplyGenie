import { cloneElement, forwardRef, isValidElement } from 'react';
import { Render, Provider, Container, useStore } from 'react-login-page';
import { Username } from './control/ui/Username';
import { Password } from './control/ui/Password';
import { Submit } from './control/ui/Submit';
import { Reset } from './control/ui/Reset';
import { Logo } from './control/ui/Logo';
import { Title } from './control/ui/Title';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './index.css';
import Header from './Customer/options.jsx';
export * from 'react-login-page';
export * from './control/ui/Username';
export * from './control/ui/Password';
export * from './control/ui/Submit';
export * from './control/ui/Reset';
export * from './control/ui/Title';
export * from './control/ui/Logo';

const RenderLogin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Select");
  const navigate = useNavigate();
  const { blocks = {}, data } = useStore();
  const { fields, buttons } = data || { fields: [] };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleSubmit = () =>{
    if(selectedOption === "Customer"){
      navigate("/Customer-options");
    }
  };
  return (
    <Render>
      <Header/>
      <div className="login-page-1-wrapper">
        <article>
          <header>
            {blocks.logo} {blocks.title}
          </header>
          {fields
            .sort((a, b) => a.index - b.index)
            .map((item, idx) => {
              if (!item.children) return null;
              return (
                <label className={`rlp-${item.name}`} key={item.name + idx}>
                  {item.children}
                </label>
              );
            })}

          <section className="dropdown-section">
            <button 
              className="dropdown-btn" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {selectedOption}
            </button>

            <ul className={`dropdown-menu ${isOpen ? "show" : ""}`}>
              <li className="dropdown-item" onClick={() => handleSelect("Customer")}>
                Customer
              </li>
              <li className="dropdown-item" onClick={() => handleSelect("Manager")}>
                Manager
              </li>
              <li className="dropdown-item" onClick={() => handleSelect("Admin")}>
                Admin
              </li>
            </ul>
          </section>

          <section className="login-page-1-wrapper">
            {buttons
              .sort((a, b) => a.index - b.index)
              .map((item, idx) => {
                const child = item.children;
                if (!isValidElement(child)) return null;
                return cloneElement(child, {
                  ...child.props,
                  key: item.name + idx,
                  onClick: handleSubmit,
                });
              })}
          </section>
        </article>

        <div className="login-page-1-drops">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </Render>
  );
};

const LoginPage = forwardRef((props, ref) => {
  const { children, className, ...divProps } = props;

  return (
    <Provider>
      <Username />
      <Password />
      <Logo />
      <Title />
      <Submit />
      <Container {...divProps} ref={ref} className={`login-page-1 ${className || ''}`}>
        <RenderLogin />
        {children}
      </Container>
    </Provider>
  );
});

const Login = LoginPage;

Login.Username = Username;
Login.Password = Password;
Login.Submit = Submit;
Login.Reset = Reset;
Login.Logo = Logo;
Login.Title = Title;
Login.displayName = 'LoginPage';

export default Login;
