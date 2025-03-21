import React, { useState } from "react";
import { Render, Provider, Container } from 'react-login-page';
import { Username } from './control/ui/Username';
import { Password } from './control/ui/Password';
import { Submit } from './control/ui/Submit';
import { Reset } from './control/ui/Reset';
import { Logo } from './control/ui/Logo';
import { Title } from './control/ui/Title';
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { app, database } from "./firebaseConfig";
import './index.css';

const RenderSignup = () => {
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
      setIsSubmitting(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      alert("Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and exactly one special character.");
      setIsSubmitting(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await addDoc(collectionRef, {
        email: formData.email, 
        password: formData.password,
        fullName: formData.fullName,
        age: formData.age,
        phoneNumber: formData.phoneNumber,
      });
      alert("Signup complete!");
      navigate("/login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("You are already registered. Try to login.");
        navigate("/login");
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
    <Render>
      <div className="login-page-1-wrapper">
        <article>
          <header>
            <Logo />
            <Title />
          </header>

          <label className="rlp-username">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
          </label>
          <label className="rlp-username">
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              required
            />
          </label>
          <label className="rlp-username">
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              required
            />
          </label>
          <label className="rlp-username">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </label>
          <label className="rlp-password">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </label>

          <section className="login-page-1-wrapper">
            <Submit onClick={handleSignup}>
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </Submit>
          </section>
        </article>

        <p className="login-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>

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

const SignupPage = React.forwardRef((props, ref) => {
  const { children, className, ...divProps } = props;

  return (
    <Provider>
      <Username />
      <Password />
      <Logo />
      <Title />
      <Submit />
      <Reset />
      <Container {...divProps} ref={ref} className={`login-page-1 ${className || ''}`}>
        <RenderSignup />
        {children}
      </Container>
    </Provider>
  );
});

const Signup = SignupPage;

Signup.Username = Username;
Signup.Password = Password;
Signup.Submit = Submit;
Signup.Reset = Reset;
Signup.Logo = Logo;
Signup.Title = Title;
Signup.displayName = 'SignupPage';

export default Signup;
