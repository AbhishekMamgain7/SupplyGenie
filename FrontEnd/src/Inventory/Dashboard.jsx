import React, { useState, useEffect } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "/src/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarehouses = async (user) => {
      if (!user) {
        navigate("/Login");
        return;
      }

      const storedWarehouse = JSON.parse(
        localStorage.getItem("selectedWarehouse")
      );
      if (!storedWarehouse) {
        setLoading(false);
        return;
      }

      try {
        const warehouseRef = collection(db, "users", user.uid, "warehouses");
        const q = query(
          warehouseRef,
          where("warehouseName", "==", storedWarehouse.warehouseName),
          where("location", "==", storedWarehouse.location)
        );

        const qsnapshot = await getDocs(q);

        if (!qsnapshot.empty) {
          setWarehouses(qsnapshot.docs[0].data());
        } else {
          console.log("No warehouses found.");
        }
      } catch (error) {
        console.error("Error fetching warehouses:", error.message);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchWarehouses(user);
      } else {
        navigate("/Login");
      }
    });

    return () => unsubscribe();
  }, [auth, db, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("selectedWarehouse");
      alert("Logged out successfully.");
      navigate("/Login");
    } catch (error) {
      console.error("Logout Error:", error.message);
      alert("Error logging out.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-overlay">
        <p className="headline">
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </p>
        <div className="user-info">
          {loading ? (
            <p>Loading warehouses...</p>
          ) : warehouses ? (
            <div className="warehouse-item">
              <h3>{warehouses.warehouseName}</h3>
              <p>📍 Location: {warehouses.location}</p>
              <p>📦 Size: {warehouses.size}</p>
              <p>👷 Employees: {warehouses.employee}</p>
              <p>🔢 Sections: {warehouses.sections}</p>
              <p>🚪 Entry Points: {warehouses.entry}</p>
              <p>🚪 Exit Points: {warehouses.exit}</p>
            </div>
          ) : (
            <p>No warehouses found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
