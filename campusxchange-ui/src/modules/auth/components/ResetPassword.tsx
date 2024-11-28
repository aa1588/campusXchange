import React, { useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ToastUtil } from '../../../utils/ToastUtils'
import { Link, useNavigate } from 'react-router-dom'
import { BACKEND_BASE_URL } from '../../../config/config'

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const token = Cookies.get('authToken')
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        setLoading(true)

        try {
            const response = await axios.post(
                `${BACKEND_BASE_URL}/api/profiles/reset-password`,
                { newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (response.status === 200) {
                setSuccess(true)
                setNewPassword('') // Reset the form field
                ToastUtil.displaySuccessToast('Success!')
            }
        } catch (err: any) {
            const fieldErrors = err.response?.data?.fieldErrors
            if (fieldErrors && fieldErrors.newPassword) {
                setError(fieldErrors.newPassword)
            } else {
                setError('An unexpected error occurred. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
            <Card className="shadow-sm">
                <Card.Body>
                    <Card.Title className="mb-4">Reset Password</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && (
                        <Alert variant="success">
                            Password reset successfully!
                        </Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                minLength={6} // Optional, for better UX
                                required
                            />
                        </Form.Group>
                        <Button
                            variant="success"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <Link to={'/home'}>
                <Button variant={'secondary'}>Go Back</Button>
            </Link>
        </div>
    )
}

export default ResetPassword
