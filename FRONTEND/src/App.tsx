import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LandingPage } from "./componnents/LandingPage";
import {LoginForm } from "./componnents/LoginForm";
import RegistrationForm from "./componnents/RegistrationForm";


import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
        </Routes>
       
      </Router>
      <footer className="footer">
        <p>©Carlos 2025 Write Stack. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
