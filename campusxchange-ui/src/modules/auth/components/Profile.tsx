import React, { useState, useEffect } from 'react'
import { Card, Button, Form, Modal } from 'react-bootstrap'
import axios from 'axios'
import Cookies from 'js-cookie'
import { BACKEND_BASE_URL } from '../../../config/config'

const Profile: React.FC = () => {
    const [profile, setProfile] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
    })
    const [showEditModal, setShowEditModal] = useState(false)
    const [updatedProfile, setUpdatedProfile] = useState({
        firstname: '',
        lastname: '',
        phone: '',
    })

    const token = Cookies.get('authToken')

    // Fetch profile details
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    `${BACKEND_BASE_URL}/api/profiles/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                setProfile(response.data)
                setUpdatedProfile({
                    firstname: response.data.firstname,
                    lastname: response.data.lastname,
                    phone: response.data.phone,
                })
            } catch (error) {
                console.error('Error fetching profile:', error)
            }
        }

        fetchProfile()
    }, [token])

    // Handle form changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedProfile({
            ...updatedProfile,
            [e.target.name]: e.target.value,
        })
    }

    // Update profile details
    const handleUpdate = async () => {
        try {
            await axios.put(
                `${BACKEND_BASE_URL}/api/profiles/update`,
                updatedProfile,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            setProfile({ ...profile, ...updatedProfile })
            setShowEditModal(false)
        } catch (error) {
            console.error('Error updating profile:', error)
        }
    }

    return (
        <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
            <Card className="shadow-sm">
                <Card.Body>
                    <Card.Title className="mb-4 text-success fw-bolder">
                        Profile Details
                    </Card.Title>
                    <p>
                        <strong>First Name:</strong> {profile.firstname}
                    </p>
                    <p>
                        <strong>Last Name:</strong> {profile.lastname}
                    </p>
                    <p>
                        <strong>Email:</strong> {profile.email}
                    </p>
                    <p>
                        <strong>Phone:</strong> {profile.phone}
                    </p>
                    <Button
                        variant="warning"
                        onClick={() => setShowEditModal(true)}
                    >
                        Edit
                    </Button>
                </Card.Body>
            </Card>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstname"
                                value={updatedProfile.firstname}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastname"
                                value={updatedProfile.lastname}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={profile.email}
                                disabled // Email is not editable
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={updatedProfile.phone}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowEditModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Profile
