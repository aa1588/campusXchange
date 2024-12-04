import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Navbar,
    Nav,
    NavDropdown,
    Container,
} from 'react-bootstrap'
import AuthService from '../modules/auth/service/authservice'
import Cookies from 'js-cookie'
import { BACKEND_BASE_URL } from '../config/config'

interface Notification {
    message: string
    timestamp: number
}

const MyTestNavBar: React.FC = () => {
    console.log("BACKEND_BASE_URL"+BACKEND_BASE_URL);
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    const isAuthenticated = Boolean(userData.subject)

    const navigate = useNavigate()

    const isUser = userData.roles === '[ROLE_USER]'
    const isAdmin = userData.roles === '[ROLE_ADMIN]'

    const clickLogOut = () => {
        AuthService.logout()
        navigate('/login')
    }

    // Notifications state
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [authToken, setAuthToken] = useState<string | undefined>(undefined)

    // useEffect(() => {
    //     const savedNotifications = localStorage.getItem('notifications')
    //     if (savedNotifications) {
    //         setNotifications(JSON.parse(savedNotifications))
    //     }
    //     const token: string | undefined = Cookies.get('authToken')
    //     const eventSourceUrl = `${BACKEND_BASE_URL}/api/notifications/subscribe?token=${token}`
    //
    //     // Connect to SSE for real-time notifications
    //     const eventSource = new EventSource(eventSourceUrl)
    //
    //     // Listen for new notifications
    //     eventSource.addEventListener('notification', (event) => {
    //         const newNotification: Notification = JSON.parse(event.data)
    //         /* Test for SSE-Notification System */
    //
    //         console.log('New SSE- Notification Received: ', newNotification)
    //
    //         /* Test for SSE-Notification System */
    //
    //         // Update state and save to localStorage
    //         setNotifications((prevState) => {
    //             const updatedNotifications = [newNotification, ...prevState]
    //             localStorage.setItem(
    //                 'notifications',
    //                 JSON.stringify(updatedNotifications)
    //             )
    //             return updatedNotifications
    //         })
    //
    //         setUnreadCount((prevCount) => prevCount + 1)
    //     })
    //
    //     // Cleanup on component unmount
    //     return () => {
    //         eventSource.close()
    //     }
    // }, [])
    // First useEffect to check for authToken
    useEffect(() => {
        console.log("Looking for authToken...")
        const token = Cookies.get('authToken')
        if (token) {
            console.log("authToken...Found")
            setAuthToken(token)
        }
    }, []) // Run once on component mount

    // Second useEffect to setup SSE only after authToken is available
    useEffect(() => {
        if (authToken) {
            const eventSourceUrl = `${BACKEND_BASE_URL}/api/notifications/subscribe?token=${authToken}`

            // Connect to SSE for real-time notifications
            const eventSource = new EventSource(eventSourceUrl)

            // Listen for new notifications
            eventSource.addEventListener('notification', (event) => {
                const newNotification: Notification = JSON.parse(event.data)
                console.log('New SSE- Notification Received: ', newNotification)

                // Update state and save to localStorage
                setNotifications((prevState) => {
                    const updatedNotifications = [newNotification, ...prevState]
                    localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
                    return updatedNotifications
                })

                setUnreadCount((prevCount) => prevCount + 1)
            })

            // Cleanup on component unmount
            return () => {
                eventSource.close()
            }
        }
    }, [authToken]) // This will run only when authToken is set

    // When the user clicks the bell, reset unread count
    const handleBellClick = () => {
        setUnreadCount(0)
    }

    const clearNotifications = () => {
        setNotifications([])
        localStorage.removeItem('notifications')
    }

    return (
        <Navbar bg="success" expand="lg" variant={'dark'}>
            <Container>
                <Navbar.Brand>
                    <Link
                        to={'/home'}
                        className="text-white text-decoration-none"
                    >
                        <i className="bi bi-shop me-1"></i>CampusXchangee
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
                                <NavDropdown
                                    title={
                                        <>
                                            {/*🛎️{' '}*/}
                                            Notifications
                                            <i
                                                className={
                                                    'bi bi-bell text-white ms-2'
                                                }
                                            ></i>
                                            {unreadCount > 0 && (
                                                <span className="badge bg-danger ms-1">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </>
                                    }
                                    id="notification-bell-dropdown"
                                    onClick={handleBellClick}
                                >
                                    <h6 className="dropdown-header">
                                        Notifications
                                    </h6>
                                    {notifications.length === 0 ? (
                                        <NavDropdown.ItemText
                                            className={'text-info'}
                                        >
                                            No new notifications
                                        </NavDropdown.ItemText>
                                    ) : (
                                        notifications
                                            .sort(
                                                (a, b) =>
                                                    b.timestamp - a.timestamp
                                            )
                                            .map((notification, index) => (
                                                <NavDropdown.Item
                                                    key={index}
                                                    as="div"
                                                >
                                                    <strong
                                                        className={'text-info'}
                                                    >
                                                        {notification.message}
                                                    </strong>
                                                    <br />
                                                    <small
                                                        className={
                                                            'text-secondary'
                                                        }
                                                    >
                                                        {new Date(
                                                            notification.timestamp
                                                        ).toLocaleString()}
                                                    </small>
                                                </NavDropdown.Item>
                                            ))
                                    )}
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item
                                        onClick={clearNotifications}
                                        className={'text-danger'}
                                    >
                                        Clear All Notifications
                                    </NavDropdown.Item>
                                </NavDropdown>
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
                                            to="/reset-password"
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

export default MyTestNavBar
