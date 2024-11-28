import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import Stats from './Stats'
import Users from './Users'
import Items from './Items'
import Reports from './Reports'
import ServerHealth from './ServerHealth'

const AdminDashboard: React.FC = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '20px' }}>
                <Routes>
                    <Route path="stats" element={<Stats />} />
                    <Route path="users" element={<Users />} />
                    <Route path="items" element={<Items />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="server-health" element={<ServerHealth />} />
                    <Route
                        path="/"
                        element={<h3>Select an option from the sidebar.</h3>}
                    />
                </Routes>
            </div>
        </div>
    )
}

export default AdminDashboard
