import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import HomePage from "./components/Home";
import HistoryPage from "./components/History";
import { SearchProvider } from "./components/SearchContext";
import "./components/Styles/Navigation.css";

const App: React.FC = () => {
  return (
    <Router>
      <SearchProvider>
        <div className="navbar">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/history">History</Link>
            </li>
          </ul>
        </div>

        <Routes>
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </SearchProvider>
    </Router>
  );
};

export default App;
