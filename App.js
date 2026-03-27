import React from "react";
import Classifier from "./Classifier";
import "./index.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <center>
          <h1>AI Powered Queue Management Using Face Detection</h1>
        </center>
      </header>

      <main className="container">
        <div className="card">
          <Classifier />
        </div>
      </main>
    </div>
  );
}

export default App;