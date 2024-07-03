import React, { useEffect, useState } from 'react';
import { Container, Dropdown, DropdownButton, Nav, Navbar } from 'react-bootstrap';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import logo from './assets/bonk.png';
import ResponsesPage from './pages/ResponsesPage';
import FieldsPage from './pages/FieldsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SubmissionPage from './pages/SubmissionPage';
import persistentStorage from './services/PersitentStorage';
import AuthenticationResponse from './types/AuthenticationResponse';
import { api } from './services/api';
import SuccessPage from './pages/SuccessPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css'

const App: React.FC = () => {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(true);

  const [show, setShow] = useState(false);
  const showDropdown = () => {
    setShow(true);
  }
  const hideDropdown = () => {
    setShow(false);
  }

  useEffect(() => {
    async function fetchUser(): Promise<void> {
      const id = persistentStorage.getUserId();
      if (id !== undefined) {
        try {
          const user = await api.getUser(id);
          setEmail(user.email);
          setLoggedIn(true);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }      
      setLoading(false); 
    }
    fetchUser();
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    setLoggedIn(() => false);
    setEmail(() => '');
    persistentStorage.removeToken();
    persistentStorage.removeUserId();
    navigate('/submission')
  };

  const onLoginSuccess = async (auth: AuthenticationResponse) => {
    persistentStorage.setToken(auth.token);
    persistentStorage.setUserId(auth.userId);

    const user = await api.getUser(auth.userId);
    setEmail(user.email);
    setLoggedIn(true);

    navigate('/submission');
  };
  const onSignupSuccess = onLoginSuccess;

  if (isLoading) return <div>Loading...</div>;

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
                <DropdownButton
                  id="user-dropdown"
                  title={email}
                  show={show}
                  onMouseEnter={showDropdown}
                  onMouseLeave={hideDropdown}
                >
                  <Dropdown.Item as={Link} to="/edit-profile">Edit Profile</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/reset-password">Reset Password</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout} className="btn btn-outline-danger">Logout</Dropdown.Item>
                </DropdownButton>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="btn btn-outline-primary">Login</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route index element={<SubmissionPage />} />
        <Route path="/responses" element={<ResponsesPage />} />
        <Route path="/submission" element={<SubmissionPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/signup" element={<SignupPage onSignupSuccess={onSignupSuccess} />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={onLoginSuccess} />} />
        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />

        <Route
          path="/fields"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <FieldsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <div>Edit Profile Private Route</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <div>Reset Password Private Route</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export { App };
