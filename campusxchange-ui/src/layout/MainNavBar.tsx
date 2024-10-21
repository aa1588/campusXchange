import { Link } from 'react-router-dom'

interface NavbarProps {
    currentUser: any
    handleLogout: () => void
}

const MainNavBar: React.FC<NavbarProps> = ({ currentUser, handleLogout }) => {
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <Link to={'/'} className="navbar-brand">
                CampusXchange
            </Link>

            {currentUser ? (
                <div className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <a
                            href="/login"
                            className="nav-link"
                            onClick={handleLogout}
                        >
                            LogOut
                        </a>
                    </li>
                </div>
            ) : (
                <div className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <Link to={'/login'} className="nav-link">
                            Login
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to={'/register'} className="nav-link">
                            Sign Up
                        </Link>
                    </li>
                </div>
            )}
        </nav>
    )
}

export default MainNavBar
