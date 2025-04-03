import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { app, database } from "/src/firebaseConfig";
import { collection, doc, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./warehouse.css";
const Warehouse = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    warehouseName: "",
    size: "",
    location: "",
    employee: "",
    sections: "",
    entry: "",
    exit: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      alert("User not logged in. Please log in first.");
      navigate("/Login");
      return;
    }
    setIsSubmitting(true);
    try {
      const userWarehouseRef = collection(
        database,
        "users",
        user.uid,
        "warehouses"
      );
      await addDoc(userWarehouseRef, {
        warehouseName: formData.warehouseName,
        size: formData.size,
        location: formData.location,
        employee: formData.employee,
        sections: formData.sections,
        entry: formData.entry,
        exit: formData.exit,
        createdAt: new Date(),
      });
      console.log("Warehouse data added successfully!");
      navigate("/Dashboard");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error adding warehouse data. Please try again.");
    } finally {
      setIsSubmitting(false);
      setFormData({
        warehouseName: "",
        size: "",
        location: "",
        employee: "",
        sections: "",
        entry: "",
        exit: "",
      });
    }
  };
  return (
    <div className="warehouse-container">
      <div className="warehouse-overlay">
        <article>
          <header>Warehouse</header>
          <form onSubmit={handleSubmit}>
            <motion.input
              name="warehouseName"
              whileFocus={{ scale: 1.05 }}
              type="text"
              placeholder="Warehouse Name"
              value={formData.warehouseName}
              onChange={handleChange}
              required
            />
            <motion.input
              name="size"
              whileFocus={{ scale: 1.05 }}
              type="number"
              placeholder="Size"
              value={formData.size}
              onChange={handleChange}
              required
            />
            <motion.input
              name="location"
              whileFocus={{ scale: 1.05 }}
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <motion.input
              name="employee"
              whileFocus={{ scale: 1.05 }}
              type="number"
              placeholder="Number of Employees"
              value={formData.employee}
              onChange={handleChange}
              required
            />
            <motion.input
              name="sections"
              whileFocus={{ scale: 1.05 }}
              type="number"
              placeholder="Number of Sections"
              value={formData.sections}
              onChange={handleChange}
              required
            />
            <motion.input
              name="entry"
              whileFocus={{ scale: 1.05 }}
              type="number"
              placeholder="Number of Entry"
              value={formData.entry}
              onChange={handleChange}
              required
            />
            <motion.input
              name="exit"
              whileFocus={{ scale: 1.05 }}
              type="number"
              placeholder="Number of Exit"
              value={formData.exit}
              onChange={handleChange}
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="enter"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Warehouse"}
            </motion.button>
          </form>
          <p className="register">
            Already registered? <Link to="/Dashboard">Details</Link>
          </p>
        </article>
      </div>
    </div>
  );
};
export default Warehouse;
