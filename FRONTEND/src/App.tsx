import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LandingPage } from "./componnents/LandingPage";
import {LoginForm } from "./componnents/LoginForm";
import RegistrationForm from "./componnents/RegistrationForm";
import {CreateBlogForm } from "./componnents/CreateBlogForm";
import BlogList from "./pages/BlogList";
import { EditBlogForm } from "./componnents/EditBlogForm";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/blogs" element={<BlogList />} />


          <Route path="/blogs/new" element={<CreateBlogForm />} />
          <Route path="/blogs/:id/edit" element={<EditBlogForm />} />

        </Routes>
       
      </Router>
      <footer className="footer" style={{ marginTop: "-10px", marginBottom: "-30px",paddingTop: "0px",paddingBottom: "0px", textAlign: "center" }}>
        <p>©WriteStack 2025. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
