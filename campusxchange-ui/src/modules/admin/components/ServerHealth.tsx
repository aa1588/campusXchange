import React, { useEffect, useState } from 'react'
import { getServerHealth } from '../services/ServerHealthService'
import { Card, Spinner, Alert } from 'react-bootstrap'
import { FaServer } from 'react-icons/fa'
import Cookies from 'js-cookie'

const ServerHealth: React.FC = () => {
    const [status, setStatus] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const token = Cookies.get('authToken')
        getServerHealth(token)
            .then((data) => {
                setStatus(data.status)
                setLoading(false)
            })
            .catch((error) => {
                setError(error.message)
                setLoading(false)
            })
    }, [])

    return (
        <div
            className="server-health-container"
            style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}
        >
            <h2 className={'text-success fw-bolder'}>Server Health</h2>
            <Card className="shadow-lg">
                <Card.Body>
                    {loading && (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    )}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {status && (
                        <div className="text-center">
                            <FaServer
                                size={80}
                                color={status === 'UP' ? 'green' : 'red'}
                            />
                            <h3 className="mt-3">
                                Status:{' '}
                                <span
                                    style={{
                                        color:
                                            status === 'UP' ? 'green' : 'red',
                                    }}
                                >
                                    {status}
                                </span>
                            </h3>
                            <p>
                                The server is{' '}
                                {status === 'UP' ? 'healthy' : 'down'}.
                            </p>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    )
}

export default ServerHealth
