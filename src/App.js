import { useEffect, useState } from "react";
import "./App.css";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import ForgotPassword from "./Pages/ForgotPassword/Index";
import ResendVerificationEmail from './Pages/ResendVerficationEmail/Index'

import LoginAdminMode from "./Pages/LoginAdminMode/Login";

import Inventory from "./Pages/Maininventory/Inventory";
import BobsCollection from "./Pages/Bobs_Collection/BobsCollection";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Load_Receipt from "./Pages/Load_Receipt/Load_Receipt";

function App() {
  const [access_token, setAccess_token] = useState(localStorage.getItem("access_token"));
  useEffect(() => {
    setAccess_token(localStorage.getItem("access_token"));
  }, [localStorage]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* {/ Public routes /} */}
          <Route path="/login" element={<Login />} />
          <Route path="/sign_up" element={<Register />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/resend_verification_email" element={<ResendVerificationEmail />} />
          <Route path="/load_receipt" element={<Load_Receipt />} />
          <Route path="/home" element={<Home />} />
          
          {/* LoginAdminMode */}
          <Route path="/login-admin-mode" element={<LoginAdminMode/>}></Route>


          {/* {/ Protected routes /} */}
          {access_token ? (
            <>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/maininventory" element={<Inventory />} />
              <Route path="/bobs_collection" element={<BobsCollection />} />
            </>
          ) : (
            // Redirect to Login if access_token not available or no match found
            <Route path="/*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
