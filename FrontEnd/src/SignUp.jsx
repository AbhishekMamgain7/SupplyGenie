import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, } from "firebase/auth";
import { app, database } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import "./SignUp.css";

const SignUp=()=> {
  const auth = getAuth(app);
  const collectionRef = collection(database, 'users');

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const specialCharCount = (password.match(/[!@#$%^&*]/g) || []).length;

    return (
      password.length >= 6 &&
      hasUpperCase &&
      hasLowerCase &&
      hasDigit &&
      specialCharCount === 1
    );
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      alert("Invalid email format.");
      setFormData({ ...formData, email: "", password: "" });
      setIsSubmitting(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      alert("Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and exactly one special character.");
      setFormData({ ...formData, password: "" });
      setIsSubmitting(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      alert("Signup complete!");
      addDoc(collectionRef, {
        email: formData.email, 
        password: formData.password,
        fullName : formData.fullName,
        age : formData.age,
        phoneNumber : formData.phoneNumber
      })
      .then(() => {
        console.log("Data Added");
      })
      .catch((error) => {
        console.log(error.message)
      })
      navigate("/Login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("You are already registered. Try to login.");
        navigate("/Login");
      } else {
        alert("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
      setFormData({
        fullName: "",
        age: "",
        phoneNumber: "",
        email: "",
        password: "",
      });
    }
  };


  return (
    <div className="login-container">
      <div className="login-overlay"></div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="login-box"
      >
        <h2 className="login-title">Create an Account</h2>
        <p className="login-subtitle">Join us and start earning rewards!</p>

        <form onSubmit={handleSignup}>
          <motion.input
            name="fullName"
            whileFocus={{ scale: 1.05 }}
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="login-input" />
          <motion.input
            name="age"
            whileFocus={{ scale: 1.05 }}
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
            className="login-input" />
          <motion.input
            name="phoneNumber"
            whileFocus={{ scale: 1.05 }}
            type="text"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="login-input" />
          <motion.input
            name="email"
            whileFocus={{ scale: 1.05 }}
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="login-input" />
          <motion.input
            name="password"
            whileFocus={{ scale: 1.05 }}
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="login-input" />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="login-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default SignUp;