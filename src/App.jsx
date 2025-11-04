import React from "react";
import UsersDashBoard from "./DashBoards/UsersDashBoard";
import Userform from "./Userform/Userform";
import { Routes, Route } from "react-router-dom";
import Navbar1 from "./Navbar/Navbar1";

const App = () => {
  return (
    <div>
      <Navbar1 />

      <Routes>
        <Route path="/" element={<Userform />} />
        <Route path="/dashboard" element={<UsersDashBoard />} />
      </Routes>
    </div>
  );
};

export default App;
