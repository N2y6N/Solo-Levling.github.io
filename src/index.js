import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Correct import for React 18
import App from "./App"; // ✅ Import App component
import "./styles.css"; // ✅ Import styles

// ✅ Set the correct music path (from public/)
const music = process.env.PUBLIC_URL + "/boss-music.mp3";

document.addEventListener("DOMContentLoaded", function () {
    let audio = document.getElementById("bg-music");
    if (audio) { // ✅ Check if element exists to avoid errors
        audio.src = music;
        audio.volume = 0.5;
    }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
