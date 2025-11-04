import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Navbar1 = () => {
  const navigate = useNavigate();

  const HandleDashBoard = () => {
    navigate("/dashboard");
  };

  return (
    <div style={{ padding: "10px", backgroundColor: "#f8f9fa" }}>
      <Button onClick={HandleDashBoard} variant="primary">
        Dashboard
      </Button>
    </div>
  );
};

export default Navbar1;
