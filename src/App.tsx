import React, { useState } from 'react';
import {Container, Dropdown, DropdownButton, Nav, Navbar } from 'react-bootstrap';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import logo from './assets/bonk.png'
import ResponsesPage from './pages/ResponsesPage';
import FieldsPage from './pages/FieldsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SubmissionPage from './pages/SubmissionPage';
import persistentStorage from './services/PersitentStorage';
import AuthenticationResponse from './types/AuthenticationResponse';
import { api } from './services/api';



const App: React.FC = () => {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')

  const navigate = useNavigate()

  const handleLogout = () => {
    setLoggedIn(() => false)
    setEmail(() => '')
    persistentStorage.removeToken()
    persistentStorage.removeUserId()
  };

  const onLoginSuccess = async (auth: AuthenticationResponse) => {
    console.log(`token: ${auth.token}`)
    console.log(`id: ${auth.userId}`)

    persistentStorage.setToken(auth.token)
    persistentStorage.setUserId(auth.userId)

    const user = await api.getUser(auth.userId)
    setEmail(user.email)
    setLoggedIn(true)

    navigate('/submission')
  }

  const onSignupSuccess = onLoginSuccess;


  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/submission">
            <img src={logo} alt="Logo" height="64" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/responses" className="btn btn-outline-primary ms-2 fs-4">Responses</Nav.Link>
              {isLoggedIn && <Nav.Link as={Link} to="/fields" className="btn btn-outline-primary ms-4 fs-4">Questions</Nav.Link>}
            </Nav>
            <Nav>
              {isLoggedIn ? (
                <DropdownButton id="user-dropdown" title={email}>
                  <Dropdown.Item as={Link} to="/edit-profile">Edit Profile</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/reset-password">Reset Password</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </DropdownButton>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>


      <Routes>
        <Route index element={<div>Submission Route</div>}/>
        <Route path="/responses" element={<ResponsesPage/>}/>
        <Route path="/submission" element={<SubmissionPage/>}/>
        {isLoggedIn && (
          <>
            <Route path="/fields" element={<FieldsPage/>}></Route>
            <Route path="/edit-profile" element={<div>Edit Profile Private Route</div>}/>
            <Route path="/reset-password" element={<div>Reset Password Private Route</div>}/>
          </>
        )}
        {!isLoggedIn && (
          <>
            <Route path="/signup" element={<SignupPage onSignupSuccess={onSignupSuccess}/>}/>
            <Route path="/login" element={<LoginPage onLoginSuccess={onLoginSuccess}/>}/>
          </>
        )}
      </Routes>
    </>
  );
};

export { App };