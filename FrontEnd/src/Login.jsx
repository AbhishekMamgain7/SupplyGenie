import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebaseConfig";
import "./SignUp.jsx";
import "./Login.css";

const Login = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    email: "",
    password: "",
    selectedOption: "" });
  const [selectedOption, setSelectedOption] = useState("Select");
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { email, password } = formData;
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      alert("Invalid email format.");
      setFormData({ email: "", password: "" });
      setIsSubmitting(false);
      return;
    }

    if (selectedOption === "Select"){
      setIsSubmitting(false);
      return;
    }
    try{
      await signInWithEmailAndPassword(auth,email,password);
      alert("Logged in successfully!");
      setFormData({email:"", password: "",selectedOption:""});
      if(selectedOption === "Customer"){
        navigate("/Customer-option");
      }
      else if(selectedOption === "Manager"){
        navigate("/Manager-option");
      }
      else if(selectedOption === "Admin"){
        navigate("/Admin-option");
      }
    }
    catch(error){
      if (error.code === "auth/invalid-credential") {
        alert("Incorrect username/password. Please try again.");
        setFormData({ email: "", password: "" });
      } else {
        alert("Error: " + error.message);
    }
  }
    finally{
      setIsSubmitting(flase);
    }
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };
  return (
    <div className="login-page-1">
      <div className="login-page-1-wrapper">
        <article>
          <header>Login</header>
          <form onSubmit={handleLogin}>
            <motion.input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              whileFocus={{ scale: 1.05 }}
              required
            />
            <motion.input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              whileFocus={{ scale: 1.05 }}
              required
            />
            
            <section className="dropdown-section">
              <button className="dropdown-btn" type="button" onClick={() => setIsOpen(!isOpen)}>
                {selectedOption}
              </button>
              <ul className={`dropdown-menu ${isOpen ? "show" : ""}`} onMouseLeave={()=> setIsOpen(false)}>
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
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="Login-btn"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </motion.button>
          </form>
          <p className="login-footer">Don't have account? <Link to ="/SignUp">SIGNUP</Link></p>
        </article>
        <div className="login-page-1-drops">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
