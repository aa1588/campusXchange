import React from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/Sidebar.css'

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <div className="admin-panel-header">
                <i className="bi bi-person-gear"></i>
                <h3 className={'text-success fw-bolder'}>Admin Dashboard</h3>
            </div>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <NavLink
                        to="/admin/dashboard/stats"
                        className={({ isActive }) =>
                            isActive
                                ? 'nav-link active text-white'
                                : 'nav-link text-success'
                        }
                    >
                        <i className="bi bi-bar-chart me-2"></i>
                        Stats
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        to="/admin/dashboard/server-health"
                        className={({ isActive }) =>
                            isActive
                                ? 'nav-link active text-white'
                                : 'nav-link text-success'
                        }
                    >
                        <i className="bi bi-database-fill-gear me-2"></i>
                        Server Health
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        to="/admin/dashboard/users"
                        className={({ isActive }) =>
                            isActive
                                ? 'nav-link active text-white'
                                : 'nav-link text-success'
                        }
                    >
                        <i className="bi bi-people me-2"></i>
                        Users
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        to="/admin/dashboard/items"
                        className={({ isActive }) =>
                            isActive
                                ? 'nav-link active text-white'
                                : 'nav-link text-success'
                        }
                    >
                        <i className="bi bi-box-seam me-2"></i>
                        Items
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        to="/admin/dashboard/reports"
                        className={({ isActive }) =>
                            isActive
                                ? 'nav-link active text-white'
                                : 'nav-link text-success'
                        }
                    >
                        <i className="bi bi-file-earmark-text me-2"></i>
                        Reports
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}

export default Sidebar
