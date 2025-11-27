import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { UserProvider } from "./UserContext";
import 'leaflet/dist/leaflet.css';
import "./index.css";

const rootElement = document.getElementById("root");

//wrap the entire app in UserProvider
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <UserProvider>
        <App />
      </UserProvider>
    </React.StrictMode>
  );
}

// ReactDOM.createRoot(document.getElementById("root")!).render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>
// );

// const rootElement = document.getElementById('root');
// if (rootElement) {
//   const root = ReactDOM.createRoot(rootElement);
//   root.render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   );
// }
