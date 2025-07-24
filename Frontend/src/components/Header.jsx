// src/components/Header.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { logOut } from '../slices/authSlice';
import {
  Container, Navbar, Nav, NavDropdown,
  Button, Badge
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';
import { FaUser, FaPlus, FaTasks, FaUsers, FaBell } from 'react-icons/fa';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logOut());

  };
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3 shadow-sm">
      <Container fluid>
        {/* Brand Logo */}
        <LinkContainer to="/">
          <Navbar.Brand className="d-flex align-items-center">
            <div className="bg-primary rounded-circle p-2 me-2">
              <FaTasks className="text-white" />
            </div>
            <span className="fw-bold">TaskFlow</span>
          </Navbar.Brand>
        </LinkContainer>

        {/* Mobile Toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Admin Navigation */}
          {userInfo && userInfo.role === 'admin' && (
            <Nav className="me-auto">
              <LinkContainer to="/create-task">
                <Nav.Link className="d-flex align-items-center">
                  <FaPlus className="me-1" /> Create Task
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/tasks">
                <Nav.Link className="d-flex align-items-center">
                  <FaTasks className="me-1" /> Task List
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/users">
                <Nav.Link className="d-flex align-items-center">
                  <FaUsers className="me-1" /> User List
                </Nav.Link>
              </LinkContainer>
            </Nav>
          )}

          {/* User Navigation */}
          {userInfo && userInfo.role === 'user' && (
            <Nav className="me-auto">
              <LinkContainer to="/tasks">
                <Nav.Link className="d-flex align-items-center">
                  <FaTasks className="me-1" /> My Tasks
                </Nav.Link>
              </LinkContainer>
            </Nav>
          )}

          {/* Right-aligned items */}
          <Nav className="ms-auto align-items-center">

            {/* Profile Dropdown */}
            {userInfo ? (
              <NavDropdown
                title={
                  <div className="d-inline-flex align-items-center">
                    <FaUser className="me-2" />
                    <span>{userInfo.name || userInfo.email}</span>
                    {userInfo.role === 'admin' && (
                      <Badge bg="info" className="ms-2">
                        Admin
                      </Badge>
                    )}
                  </div>
                }
                id="basic-nav-dropdown"
                align="end"
              >
                <LinkContainer to="/profile">
                  <NavDropdown.Item>
                    <FaUser className="me-2" /> Update Profile
                  </NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logoutHandler}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Button variant="outline-light" className="me-2">Login</Button>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Button variant="primary">Register</Button>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;