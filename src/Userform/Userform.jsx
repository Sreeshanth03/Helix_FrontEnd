import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import axios from "axios";
import "./Userform.css";

const Userform = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    country: "",
  });

  const [alertMessage, setAlertMessage] = useState(""); // for showing alerts
  const [alertType, setAlertType] = useState("success"); // success or danger

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage(""); // clear old alerts

    try {
      const res = await axios.post(
        "https://helix1-14nt.onrender.com/userform/createform",
        formData
      );

      setAlertType("success");
      setAlertMessage("✅ Form submitted successfully!");
      console.log("Response:", res.data);

      setFormData({ name: "", mobile: "", email: "", address: "", country: "" });
    } catch (error) {
      console.error("Error:", error);

      if (error.response && error.response.status === 409) {
        // Handle duplicate error (409 from backend)
        setAlertType("danger");
        setAlertMessage("⚠️ Duplicate entry found! Email or Mobile already exists.");
      } else {
        setAlertType("danger");
        setAlertMessage("❌ Failed to submit form. Please try again.");
      }
    }
  };

  return (
    <Container className="userform-container">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card className="shadow-lg p-4 mt-5 rounded-4">
            <h3 className="text-center mb-4 fw-bold text-primary">User Form</h3>

            {/* ✅ Alert message shown here */}
            {alertMessage && (
              <Alert
                variant={alertType}
                className="text-center fw-semibold"
                onClose={() => setAlertMessage("")}
                dismissible
              >
                {alertMessage}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="mobile"
                  placeholder="Enter your mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  placeholder="Enter your country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-center">
                <Button type="submit" variant="primary" size="lg" className="px-5">
                  Submit
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Userform;
