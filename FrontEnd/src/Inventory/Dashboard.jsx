import React, { useState, useEffect } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { app } from "/src/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigate = useNavigate();
  const [warehouseDocId, setWarehouseDocId] = useState(null);
  const [warehouses, setWarehouses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [sectionInputs, setSectionInputs] = useState({});

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
          const docData = qsnapshot.docs[0].data();
          const docId = qsnapshot.docs[0].id;
          setWarehouseDocId(docId);
          setWarehouses(docData);

          const inputs = {};
          docData.sections?.forEach((section) => {
            inputs[section.name] = {
              sizes: section.boxSizes || { Small: 0, Medium: 0, Large: 0 },
              total:
                (section.boxSizes?.Small || 0) +
                (section.boxSizes?.Medium || 0) +
                (section.boxSizes?.Large || 0),
            };
          });
          setSectionInputs(inputs);
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
      alert("Logout Error.");
    }
  };

  const handleInputChange = (sectionName, size, value) => {
    const updatedInputs = { ...sectionInputs };
    if (!updatedInputs[sectionName]) {
      updatedInputs[sectionName] = { sizes: {}, total: 0 };
    }

    const section = warehouses.sections.find((sec) => sec.name === sectionName);
    const maxAllowed =
      size === "Small"
        ? section.smallBoxes
        : size === "Medium"
        ? section.mediumBoxes
        : section.largeBoxes;

    const parsedValue = parseInt(value);
    if (isNaN(parsedValue) || parsedValue < 0) return;

    const cappedValue = Math.min(parsedValue, maxAllowed || Infinity);
    updatedInputs[sectionName].sizes[size] = cappedValue;

    updatedInputs[sectionName].total = Object.values(
      updatedInputs[sectionName].sizes
    ).reduce((sum, val) => sum + val, 0);

    setSectionInputs(updatedInputs);
  };

  const handleUpdateBoxes = async () => {
    if (!warehouseDocId || !warehouses?.sections) return;
    setUpdating(true);

    const updatedSections = warehouses.sections.map((section) => {
      const inputData = sectionInputs[section.name] || {};
      const sizes = inputData.sizes || {};
      const total = Object.values(sizes).reduce((sum, val) => sum + val, 0);

      return {
        ...section,
        currentBoxes: total,
        boxSizes: sizes,
      };
    });

    try {
      const warehouseDocRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "warehouses",
        warehouseDocId
      );
      await updateDoc(warehouseDocRef, { sections: updatedSections });
      setWarehouses({ ...warehouses, sections: updatedSections });
      alert("Section box counts updated.");
    } catch (error) {
      alert("Error saving section data.");
    } finally {
      setUpdating(false);
    }
  };

  const renderBar = (value, max) => {
    const percentage = Math.min((value / max) * 100, 100);
    const barColor =
      percentage < 60 ? "green" : percentage < 90 ? "orange" : "red";

    return (
      <div className="bar-wrapper">
        <div
          className="bar"
          style={{ width: `${percentage}%`, backgroundColor: barColor }}
        >
          {value}/{max}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-overlay">
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>

        <div className="dashboard-layout">
          {/* Left Side - Warehouse Info */}
          <div className="dashboard-left">
            {loading ? (
              <p>Loading warehouses...</p>
            ) : warehouses ? (
              <div>
                <h3>{warehouses.warehouseName}</h3>
                <p>📍 Location: {warehouses.location}</p>
                <p>📦 Size: {warehouses.size} sq.ft.</p>
                <p>👷 Employees: {warehouses.employee}</p>
                <p>🔢 Sections: {warehouses.sections.length}</p>
                <p>🚪 Entry Points: {warehouses.entry}</p>
                <p>🚪 Exit Points: {warehouses.exit}</p>
              </div>
            ) : (
              <p>No warehouses found.</p>
            )}
          </div>

          {/* Right Side - Section Inputs */}
          <div className="dashboard-right">
            {warehouses?.sections?.map((section) => {
              const totalCapacity =
                (section.smallBoxes || 0) +
                (section.mediumBoxes || 0) +
                (section.largeBoxes || 0);

              const currentTotal = sectionInputs[section.name]?.total || 0;
              const sectionPer = (currentTotal / totalCapacity) * 100;
              return (
                <div key={section.name} className="section-card">
                  <h4>{section.name}</h4>

                  <div className="max-box-info">
                    <ul>
                      <li>Small: {section.smallBoxes || 0}</li>
                      <li>Medium: {section.mediumBoxes || 0}</li>
                      <li>Large: {section.largeBoxes || 0}</li>
                    </ul>
                  </div>

                  <p>
                    Total Entered: <strong>{currentTotal}</strong>
                  </p>

                  {["Small", "Medium", "Large"].map((size) => {
                    const maxValue =
                      size === "Small"
                        ? section.smallBoxes
                        : size === "Medium"
                        ? section.mediumBoxes
                        : section.largeBoxes;

                    return (
                      <div key={size} className="size-input">
                        <label>
                          {size} (Max: {maxValue || 0})
                        </label>
                        {renderBar(
                          sectionInputs[section.name]?.sizes?.[size] || 0,
                          maxValue || 0
                        )}
                        <input
                          type="number"
                          min="0"
                          max={maxValue || ""}
                          value={
                            sectionInputs[section.name]?.sizes?.[size] || ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              section.name,
                              size,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    );
                  })}

                  {currentTotal > totalCapacity && (
                    <p className="warning-text">⚠️ Exceeds total capacity!</p>
                  )}
                </div>
              );
            })}

            <div className="dashboard-actions">
              <button
                className="update-btn"
                onClick={handleUpdateBoxes}
                disabled={updating}
              >
                {updating ? "Updating..." : "Update Box Counts"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
