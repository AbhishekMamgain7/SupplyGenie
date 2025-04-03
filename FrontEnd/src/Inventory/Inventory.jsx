import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { app } from "/src/firebaseConfig";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "./Inventory.css";
const Inventory = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);
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
    const user = auth.currentUser;
    if (!user) {
      alert("User not logged in. Please log in first.");
      navigate("/Login");
      return;
    }
    try {
      const warehouseRef = collection(db, "users", user.uid, "warehouses");
      const q = query(
        warehouseRef,
        where("warehouseName", "==", formData.warehouseName.trim()),
        where("location", "==", formData.location.trim())
      );

      const qSnapshot = await getDocs(q);
      if (!qSnapshot.empty) {
        navigate("/Inventory/Dashboard");
        setFormData({ warehouseName: "", location: "" });
      } else {
        alert("Warehouse not found! Please check the details or register.");
      }
      setFormData({ warehouseName: "", location: "" });
    } catch (error) {
      alert("Error: " + error.message);
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
