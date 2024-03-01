// src/components/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import MainPage from "./components/Main";
import HistoryPage from "./components/History";
import "./components/Navigation.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="navbar">
        <ul>
          <li>
            <Link to="/">Main</Link>
          </li>
          <li>
            <Link to="/history">History</Link>
          </li>
        </ul>
      </div>

      <Routes>
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
};

export default App;
