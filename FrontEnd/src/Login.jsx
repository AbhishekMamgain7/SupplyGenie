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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { email, password } = formData;
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      alert("Invalid email format.");
      setIsSubmitting(false);
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/manager");
      setFormData({ email: "", password: "", selectedOption: "Select" });
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        alert("Incorrect username/password. Please try again.");
        setFormData({ email: "", password: "" });
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-1">
      <header className="header-login">
        <div className="header-login-title">SupplyGenie</div>
        <nav className="header-login-nav">
          <ul className="header-login-menu">
            <li className="header-login-menu-item">
              <Link to="/SignUp" className="header-login-link">
                SignUp
              </Link>
            </li>
            <li className="header-login-menu-item">
              <Link to="/Policies" className="header-login-link">
                Policies
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <div className="login-page-1-wrapper">
        <article>
          <p className="Heading">Login</p>
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
          <p className="login-footer">
            Don't have account? <Link to="/SignUp">SIGNUP</Link>
          </p>
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
