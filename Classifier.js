import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tmImage from "@teachablemachine/image";

const MODEL_URL = "/model/"; // rename from URL to avoid clash

function Classifier() {
  const webcamRef = useRef(null);
  const [mode, setMode] = useState("upload");
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState("No prediction yet");

  // Handle file upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imgURL = window.URL.createObjectURL(file); // use window.URL
    setImage(imgURL);
    setPrediction("Predicting...");
    await predictImage(imgURL);
  };

  // Capture from webcam
  const captureWebcam = () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) {
      alert("Webcam not ready. Try again.");
      return;
    }
    setImage(screenshot);
    setPrediction("Predicting...");
    predictImage(screenshot);
  };

  // Prediction logic using Teachable Machine
  const predictImage = async (imgSrc) => {
    try {
      const modelURL = MODEL_URL + "model.json";
      const metadataURL = MODEL_URL + "metadata.json";

      const model = await tmImage.load(modelURL, metadataURL);

      const img = document.createElement("img");
      img.src = imgSrc;

      img.onload = async () => {
        const predictions = await model.predict(img);
        const top = predictions.sort((a, b) => b.probability - a.probability)[0];
        setPrediction(`${top.className} (${(top.probability * 100).toFixed(2)}%)`);
      };
    } catch (error) {
      console.error("Prediction error:", error);
      setPrediction("Prediction failed. Check console.");
    }
  };

  return (
    <div className="classifier">
      <div className="toggle">
        <button
          className={mode === "upload" ? "active" : ""}
          onClick={() => setMode("upload")}
        >
          Upload
        </button>
        <button
          className={mode === "webcam" ? "active" : ""}
          onClick={() => setMode("webcam")}
        >
          Webcam
        </button>
      </div>

      {mode === "upload" && (
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      )}

      {mode === "webcam" && (
        <div className="webcam-box">
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="webcam" />
          <button onClick={captureWebcam}>Capture</button>
        </div>
      )}

      {image && (
        <div className="preview">
          <img src={image} alt="preview" />
        </div>
      )}

      {prediction && (
        <div
          style={{
            marginTop: 15,
            fontWeight: 600,
            color: "#4f46e5",
            fontSize: 18,
          }}
        >
          Prediction: {prediction}
        </div>
      )}
    </div>
  );
}

export default Classifier;