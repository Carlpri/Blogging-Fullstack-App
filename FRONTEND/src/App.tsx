import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LandingPage } from "./componnents/LandingPage";
import {LoginForm } from "./componnents/LoginForm";
import RegistrationForm from "./componnents/RegistrationForm";
import {CreateBlogForm } from "./componnents/CreateBlogForm";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import { EditBlogForm } from "./componnents/EditBlogForm";
import ChangePasswordForm from "./componnents/ChangePasswordForm";
import EditProfileForm from "./componnents/EditProfileForm";
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
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/blogs/new" element={<CreateBlogForm />} />
          <Route path="/blogs/:id/edit" element={<EditBlogForm />} />
          <Route path="/change-password" element={<ChangePasswordForm />} />
          <Route path="/edit-profile" element={<EditProfileForm />} />

        </Routes>
       
      </Router>
      <footer className="footer" style={{ marginTop: "-10px", marginBottom: "-30px",paddingTop: "0px",paddingBottom: "0px", textAlign: "center" }}>
        <p>©Blogit 2025. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
