import React, { useState, useRef, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { app } from "/src/firebaseConfig";
import "./Stocks.css";

const storage = getStorage(app);
const db = getFirestore(app);

const Stocks = () => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [predictionOutput, setPredictionOutput] = useState([]);
  const [predicting, setPredicting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
          if (firebaseUser) {
            setUser(firebaseUser);
            setUserId(firebaseUser.uid);
          } else {
            setUser(null);
            setUserId(null);
          }
        });
        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("❌ Persistence error:", error);
      });
  }, []);

  const sendTokenToBackend = async () => {
    if (user) {
      return await user.getIdToken(true);
    }
    return null;
  };

  const handlePredict = async () => {
    const idToken = await sendTokenToBackend();
    if (!idToken) {
      setMessage("❌ You must be logged in to predict.");
      return;
    }

    setPredicting(true);
    setMessage("⏳ Running prediction...");

    try {
      const runModelResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/run_model`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!runModelResponse.ok) {
        throw new Error("Prediction request failed");
      }

      const runModelData = await runModelResponse.json();

      if (runModelData.message?.includes("Model executed successfully")) {
        const outputResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/get-output`
        );

        if (!outputResponse.ok) {
          throw new Error("Failed to fetch prediction output");
        }

        const outputData = await outputResponse.json();

        setPredictionOutput(
          Array.isArray(outputData.output) ? outputData.output : []
        );
        setMessage("✅ Prediction Complete!");
      } else {
        setPredictionOutput([]);
        setMessage("❌ Prediction failed.");
      }
    } catch (err) {
      console.error("Prediction error:", err);
      setPredictionOutput([]);
      setMessage("❌ Error fetching prediction.");
    }

    setPredicting(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setPredictionOutput([]);
    setUploadStatus(null);
  };

  const handleUpload = async () => {
    if (!user || !userId) {
      setMessage("❌ User not authenticated.");
      return;
    }

    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    setUploading(true);
    const storageRef = ref(
      storage,
      `orders/${userId}/${Date.now()}_${file.name}`
    );

    try {
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);

      const userOrdersRef = collection(db, "users", userId, "orders");
      await addDoc(userOrdersRef, {
        fileName: file.name,
        fileURL,
        timestamp: serverTimestamp(),
      });

      setUploadStatus("success");
      setMessage("✅ File uploaded successfully!");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setMessage("❌ Upload failed. Try again.");
    }

    setUploading(false);
  };

  return (
    <div className="placeorder-container">
      <div className="placeorder-overlay">
        <article>
          <h2>Place Order</h2>

          <a className="template-download" href="/template.csv" download>
            📥 Download Order Template
          </a>

          <input
            type="file"
            onChange={handleFileChange}
            className="file-upload-section"
            required
            ref={fileInputRef}
          />

          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="upload-btn"
          >
            {uploading ? "Uploading..." : "Upload Order"}
          </button>

          <button
            className="predict-btn"
            onClick={handlePredict}
            disabled={uploadStatus !== "success" || predicting}
          >
            {predicting ? "Predicting..." : "Predict Output"}
          </button>

          {message && (
            <p
              className={
                message.includes("✅") ? "success-message" : "error-message"
              }
            >
              {message}
            </p>
          )}

          {Array.isArray(predictionOutput) && predictionOutput.length > 0 && (
            <div className="prediction-table-container">
              <h3 className="table-title">📊 Prediction Results</h3>
              <table className="prediction-table">
                <thead>
                  <tr>
                    <th>Warehouse</th>
                    <th>Category</th>
                    <th>Predicted Order Qty</th>
                    <th>Refill Needed</th>
                    <th>Predicted Refill Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {predictionOutput.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.Warehouse}</td>
                      <td>{row.Category}</td>
                      <td>{row["Predicted Order Qty"]}</td>
                      <td>{row["Refill Needed (0/1)"]}</td>
                      <td>{row["Predicted Refill Qty"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default Stocks;
