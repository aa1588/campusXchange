import { Component } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import IUser from './type/user'

import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'

type Props = {}

type State = {
    currentUser: IUser | undefined
}

class App extends Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            currentUser: undefined,
        }
    }

    render() {
        const { currentUser } = this.state

        return (
            <div>
                <nav className="navbar navbar-expand navbar-dark bg-dark">
                    <Link to={'/'} className="navbar-brand">
                        CampusXchange
                    </Link>

                    <div className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to={'/home'} className="nav-link">
                                Home
                            </Link>
                        </li>
                    </div>

                    {currentUser ? (
                        <div className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link to={'/profile'} className="nav-link">
                                    {currentUser.email}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a href="/login" className="nav-link">
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

                <div className="container mt-3">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </div>
            </div>
        )
    }
}

export default App
