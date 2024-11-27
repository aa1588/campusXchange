import React, { useEffect, useState } from 'react'
import { fetchUsers, changeUserStatus } from '../services/UsersDashboardService'
import { Table, Spinner, Dropdown, DropdownButton } from 'react-bootstrap'
import Cookies from 'js-cookie'
import { FaCheckCircle, FaBan, FaClock } from 'react-icons/fa' // Importing icons

interface User {
    id: number
    firstname: string
    lastname: string
    email: string
    phone: string
    role: string
    accountStatus: string
    createdAt: string
}

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const token = Cookies.get('authToken') || ''

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchUsers(token)
                setUsers(data)
            } catch (error) {
                console.error('Failed to fetch users', error)
            } finally {
                setLoading(false)
            }
        }
        loadUsers()
    }, [token])

    const handleStatusChange = async (userId: number, status: string) => {
        try {
            await changeUserStatus(userId, status, token)
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId
                        ? { ...user, accountStatus: status }
                        : user
                )
            )
        } catch (error) {
            console.error('Failed to change account status', error)
        }
    }

    if (loading) {
        return <Spinner animation="border" variant="primary" />
    }

    return (
        <div>
            <h2>Users</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th className={'text-success'}>#</th>
                        <th className={'text-success'}>First Name</th>
                        <th className={'text-success'}>Last Name</th>
                        <th className={'text-success'}>Email</th>
                        <th className={'text-success'}>Phone</th>
                        <th className={'text-success'}>Role</th>
                        <th className={'text-success'}>Account Status</th>
                        <th className={'text-success'}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td className={'text-success'}>{index + 1}</td>
                            <td>{user.firstname}</td>
                            <td>{user.lastname}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td className={'fw-bolder'}>{user.role}</td>
                            <td
                                className={
                                    'text-bg-light text-success fw-bolder'
                                }
                            >
                                {user.accountStatus}
                            </td>
                            <td>
                                <DropdownButton
                                    id={`dropdown-status-${user.id}`}
                                    title="Change Status"
                                    size="sm"
                                    variant="outline-warning"
                                    disabled={user.role === 'ADMIN'} // Disable if role is ADMIN
                                >
                                    <Dropdown.Item
                                        className={'text-success'}
                                        onClick={() =>
                                            handleStatusChange(
                                                user.id,
                                                'ACTIVE'
                                            )
                                        }
                                    >
                                        <FaCheckCircle className="mr-2 text-success" />{' '}
                                        Activate
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        className={'text-danger'}
                                        onClick={() =>
                                            handleStatusChange(
                                                user.id,
                                                'FROZEN'
                                            )
                                        }
                                    >
                                        <FaBan className="mr-2 text-danger" />{' '}
                                        Freeze
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        className={'text-info'}
                                        onClick={() =>
                                            handleStatusChange(
                                                user.id,
                                                'INACTIVE'
                                            )
                                        }
                                    >
                                        <FaClock className="mr-2 text-info" />{' '}
                                        Deactivate
                                    </Dropdown.Item>
                                </DropdownButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default Users
