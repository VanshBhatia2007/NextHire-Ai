import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Auth from "./pages/auth";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setuserData } from "./redux/userSlice";
import AppNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import Pricing from "./pages/pricing";

export const ServerUrl = "http://localhost:8000"

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const hideNavbar = location.pathname === "/auth";

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/user/current-user", { withCredentials: true })
        dispatch(setuserData(result.data))
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  }, [])

  return (
    <>
      {!hideNavbar && <AppNavbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
      {!hideNavbar && <Footer />}
    </>
  );
}

export default App;