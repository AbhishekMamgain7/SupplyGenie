import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { app, database } from "/src/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
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
    numSections: "",
    entry: "",
    exit: "",
  });
  const [sections, setSections] = useState([]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSectionCountChange = (e) => {
    const count = parseInt(e.target.value);
    setFormData({ ...formData, numSections: count });
    const sectionArray = Array.from({ length: count }, () => ({
      name: "",
      largeBoxes: "",
      mediumBoxes: "",
      smallBoxes: "",
    }));
    setSections(sectionArray);
  };

  const handleSectionDetailChange = (index, key, value) => {
    const updatedSections = [...sections];
    updatedSections[index][key] = value;
    setSections(updatedSections);
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
        sections: sections,
        entry: formData.entry,
        exit: formData.exit,
        createdAt: new Date(),
      });
      console.log("Warehouse data added successfully!");
      navigate("/Inventory/Inventory");
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
        numSections: "",
        entry: "",
        exit: "",
      });
    }
  };
  return (
    <div className="warehouse-container">
      <header className="header">
        <div className="header-title">SupplyGenie</div>
        <nav className="header-nav">
          <ul className="header-menu">
            <li className="header-menu-item">
              <Link to="/" className="header-link">
                Home
              </Link>
            </li>
            <li className="header-menu-item">
              <Link to="/Policies" className="header-link">
                Policies
              </Link>
            </li>
            <li className="header-menu-item"></li>
          </ul>
        </nav>
      </header>
      <div className="warehouse-overlay">
        <article>
          <p className="wName">REGISTER WAREHOUSE</p>
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

            {/* Section Dropdown */}
            <select
              name="numSections"
              className="numSection"
              value={formData.numSections}
              onChange={handleSectionCountChange}
              required
            >
              <option value="">Enter number of sections </option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>

            {/* Section Inputs */}
            {sections.map((section, index) => (
              <div key={index}>
                <motion.input
                  type="text"
                  className="select-section"
                  placeholder={`Section ${index + 1} Name`}
                  value={section.name}
                  onChange={(e) =>
                    handleSectionDetailChange(index, "name", e.target.value)
                  }
                  whileFocus={{ scale: 1.05 }}
                  required
                />
                <div className="Box-size">
                  <motion.input
                    type="number"
                    placeholder={`Max Boxes (Large)`}
                    value={section.largeBoxes}
                    onChange={(e) =>
                      handleSectionDetailChange(
                        index,
                        "largeBoxes",
                        e.target.value
                      )
                    }
                    whileFocus={{ scale: 1.05 }}
                    required
                  />
                  <motion.input
                    type="number"
                    placeholder={`Max Boxes (Medium)`}
                    value={section.mediumBoxes}
                    onChange={(e) =>
                      handleSectionDetailChange(
                        index,
                        "mediumBoxes",
                        e.target.value
                      )
                    }
                    whileFocus={{ scale: 1.05 }}
                    required
                  />
                  <motion.input
                    type="number"
                    placeholder={`Max Boxes (Small)`}
                    value={section.smallBoxes}
                    onChange={(e) =>
                      handleSectionDetailChange(
                        index,
                        "smallBoxes",
                        e.target.value
                      )
                    }
                    whileFocus={{ scale: 1.05 }}
                    required
                  />
                </div>
              </div>
            ))}
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
            Already registered? <Link to="/Inventory/Inventory">Details</Link>
          </p>
        </article>
      </div>
    </div>
  );
};
export default Warehouse;
