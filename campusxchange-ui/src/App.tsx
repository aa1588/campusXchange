import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import ToastConfiguration from './config/ToastConfiguration'

import IUser from './modules/auth/model/user'

import { Navigate } from 'react-router-dom'
import Login from './modules/auth/components/Login'
import Register from './modules/auth/components/Register'
import Home from './components/Home'
import CustomNavBar from './layout/CustomNavBar'
import AuthService from './modules/auth/service/authservice'
import Dashboard from './modules/dashboard/components/Dashboard'
import ItemDetail from './modules/items/components/ItemDetail'
import AddItemForm from './modules/items/components/AddItemForm'
import EditItem from './modules/items/components/EditItem'

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined)
    const [redirect, setRedirect] = useState<string | null>(null)

    useEffect(() => {
        updateUser()
    }, [])

    const handleLogout = () => {
        AuthService.logout()
        setRedirect('/login')
        setCurrentUser(undefined)
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    const updateUser = () => {
        const user = AuthService.getCurrentUser()
        if (user) {
            setCurrentUser(user)
        }
    }

    return (
        <>
            <ToastConfiguration />

            <div>
                {/*<MainNavBar currentUser={currentUser} handleLogout={handleLogout} />*/}
                <CustomNavBar />

                <div className="container mt-3">
                    <Routes>
                        <Route
                            path="/"
                            element={<Login updateUser={updateUser} />}
                        />
                        <Route path="/home" element={<Home />} />
                        <Route
                            path="/login"
                            element={<Login updateUser={updateUser} />}
                        />
                        <Route path="/register" element={<Register />} />
                        <Route path={'/dashboard'} element={<Dashboard />} />
                        <Route path="/items/:id" element={<ItemDetail />} />
                        <Route
                            path="/add-item-for-sale"
                            element={<AddItemForm />}
                        />
                        <Route path="/edit-item/:id" element={<EditItem />} />
                    </Routes>
                </div>
            </div>
        </>
    )
}

export default App
