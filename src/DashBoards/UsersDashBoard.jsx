import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Container,
  Table,
  Form,
  Button,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./UserDashBoard.css";

const UsersDashBoard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [duplicateMessage, setDuplicateMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(
          "https://helix1-14nt.onrender.com/userform/Getalluser"
        );
        const userData = response.data.data || [];

        const duplicates = findDuplicates(userData);
        if (duplicates.length > 0) {
          setDuplicateMessage(
            `Warning: Duplicate email or mobile entries found for → ${duplicates.join(", ")}`
          );
        } else {
          setDuplicateMessage("");
        }

        setUsers(userData);
        setFilteredUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  // Detect duplicates by email or mobile
  const findDuplicates = (userData) => {
    const emailMap = new Map();
    const mobileMap = new Map();
    const duplicates = [];

    userData.forEach((user) => {
      if (user.email) {
        if (emailMap.has(user.email)) {
          duplicates.push(`${user.name || "Unknown"} (Email: ${user.email})`);
        } else {
          emailMap.set(user.email, true);
        }
      }
      if (user.mobile) {
        if (mobileMap.has(user.mobile)) {
          duplicates.push(`${user.name || "Unknown"} (Mobile: ${user.mobile})`);
        } else {
          mobileMap.set(user.mobile, true);
        }
      }
    });

    return duplicates;
  };

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    if (!value) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((user) => {
      return (
        (user.name && user.name.toLowerCase().includes(value)) ||
        (user.email && user.email.toLowerCase().includes(value)) ||
        (user.mobile && user.mobile.toString().includes(value)) ||
        (user.address && user.address.toLowerCase().includes(value)) ||
        (user.country && user.country.toLowerCase().includes(value))
      );
    });

    setFilteredUsers(filtered);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "UsersData.xlsx");
  };

  return (
    <Container className="dashboard-container">
      <Card className="shadow-lg p-4 mt-4 rounded-4">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">User Dashboard</h2>
          <h5 className="text-muted">
            View, filter, and download user details easily
          </h5>
        </div>

        <div className="text-start mb-3">
          <Button variant="secondary" onClick={() => navigate("/")}>
            ← Back
          </Button>
        </div>

        {duplicateMessage && (
          <Alert variant="danger" className="text-center fw-bold">
            {duplicateMessage}
          </Alert>
        )}

        <Row className="mb-3 justify-content-center text-center">
          <Col xs={12} md={8} lg={6}>
            <Form.Control
              type="text"
              value={search}
              onChange={handleFilter}
              placeholder="Search by Name, Email, Mobile, Address, or Country"
              className="mb-3"
            />
          </Col>
          <Col xs="auto">
            <Button variant="success" onClick={downloadExcel}>
              Download Excel
            </Button>
          </Col>
        </Row>

        {filteredUsers.length === 0 ? (
          <p className="text-center text-muted">No users found.</p>
        ) : (
          <div className="table-responsive">
            <Table bordered hover striped className="align-middle text-center">
              <thead className="table-primary">
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.mobile}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>{user.country}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default UsersDashBoard;
