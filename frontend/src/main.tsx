import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ReactDOM.createRoot(document.getElementById("root")!).render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>
// );

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
