import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FieldsPage from '../pages/FieldsPage'; 
import ResponsesPage from '../pages/ResponsesPage'; 
import logo from '../assets/bonk.png';
import { SubmissionPage } from '../pages/SubmissionPage';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <NavigationBar />
        <PageContent />
      </div>
    </Router>
  );
};

const NavigationBar: React.FC = () => {
  return (
    <Navbar expand="lg" bg="light" variant="light">
      <Navbar.Brand as={Link} to="/" className="mx-auto">
        <img
          src={logo}
          width="128"
          height="128"
          className="d-inline-block align-top"
          alt="Logo"
        />
      </Navbar.Brand>
      <Navbar.Collapse className="justify-content-center">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/fields" className="btn btn-outline-secondary mx-2">Fields</Nav.Link>
          <Nav.Link as={Link} to="/responses" className="btn btn-outline-secondary mx-2">Responses</Nav.Link>
          <NavDropdown title="Profile" id="basic-nav-dropdown">
            <NavDropdown.Item>Edit Profile</NavDropdown.Item>
            <NavDropdown.Item>Change Password</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item>Log Out</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

const PageContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/fields" element={<FieldsPage/>}/>
      <Route path="/responses" element={<ResponsesPage/>}/>
      <Route path="/" element={<SubmissionPage/>}/>
    </Routes>
  );
};

export {App};