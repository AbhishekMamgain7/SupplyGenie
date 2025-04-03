import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { app } from "/src/firebaseConfig";
import { getAuth, getAdditionalUserInfo } from "firebase/auth";
import "./Inventory.css";
const Inventory = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    warehouseName: "",
    location: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await getAdditionalUserInfo(auth, warehouseName, location);
      navigate("/Inventory/invDashboard");
      setFormData({ warehouseName: "", location: "" });
    } catch (error) {
      alert("Error: " + error.message);
      setFormData({ warehouseName: "", location: "" });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="inventory-container">
      <div className="inventory-overlay">
        <article>
          <header>Enter Details</header>
          <form onSubmit={handleSubmit}>
            <motion.input
              name="warehouseName"
              type="text"
              placeholder="Warehouse Name"
              value={formData.warehouseName}
              onChange={handleChange}
              whileFocus={{ scale: 1.05 }}
              required
            />
            <motion.input
              name="location"
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              whileFocus={{ scale: 1.05 }}
              required
            />
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="enter"
            >
              {isSubmitting ? "Entering..." : "Enter"}
            </motion.button>
            <p className="register">
              Haven't registered yet?{" "}
              <Link to="/Inventory/warehouse">REGISTER</Link>
            </p>
          </form>
        </article>
      </div>
    </div>
  );
};
export default Inventory;
