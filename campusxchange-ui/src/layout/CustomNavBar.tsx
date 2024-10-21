import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap'
import AuthService from '../modules/auth/service/authservice'

const CustomNavBar: React.FC = () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    const isAuthenticated = Boolean(userData.subject) // Check if user is authenticated

    const navigate = useNavigate()

    const isUser = userData.roles === '[ROLE_USER]'
    const isAdmin = userData.roles === '[ROLE_ADMIN]'

    const clickLogOut = () => {
        AuthService.logout()
        navigate('/login')
    }

    return (
        <Navbar bg="success" expand="lg" variant={'dark'}>
            <Container>
                <Navbar.Brand>
                    <Link
                        to={'/home'}
                        className="text-white text-decoration-none"
                    >
                        <i className="bi bi-shop me-1"></i>CampusXchange
                        Marketplace
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {isUser && (
                            <>
                                <Link
                                    to={'/wishlist'}
                                    className="nav-link ms-5"
                                >
                                    Wishlist
                                </Link>
                                <Link to={'/dashboard'} className="nav-link">
                                    Dashboard
                                </Link>
                                <Link to={'/history'} className="nav-link">
                                    History
                                </Link>
                            </>
                        )}
                        {isAdmin && (
                            <Link to={'/admin/dashboard'} className="nav-link">
                                Admin Dashboard
                            </Link>
                        )}
                    </Nav>

                    <Nav className="ms-auto">
                        {isAuthenticated ? (
                            <>
                                <div className="d-flex">
                                    <NavDropdown
                                        title={userData.subject}
                                        id="basic-nav-dropdown"
                                        className="text-white"
                                    >
                                        <NavDropdown.Item
                                            as={Link}
                                            to="/profile"
                                        >
                                            Profile
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            as={Link}
                                            to="/change-password"
                                        >
                                            Change Password
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={clickLogOut}>
                                            <i className="bi bi-power"></i>{' '}
                                            LogOut
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </div>
                            </>
                        ) : (
                            <Nav className="d-flex">
                                <Link to={'/login'} className="nav-link">
                                    Login
                                </Link>
                            </Nav>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default CustomNavBar
