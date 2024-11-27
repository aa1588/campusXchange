import React, { useEffect, useState } from 'react'
import { fetchDashboardStats } from '../services/StatsService' // Import the service
import { Card, Row, Col, Spinner } from 'react-bootstrap'
import { Pie } from 'react-chartjs-2'
import 'chart.js/auto'
import Cookies from 'js-cookie'
import '../styles/Stats.css' // Add a CSS file for custom styles if needed

interface DashboardStats {
    activeUsers: number
    inactiveUsers: number
    frozenUsers: number
    totalUsers: number
    totalCategories: number
    totalItems: number
    itemsCountByCategory: Record<string, number>
}

const Stats: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const token: string | undefined = Cookies.get('authToken')

    useEffect(() => {
        const getStats = async () => {
            try {
                const data = await fetchDashboardStats(token)
                setStats(data)
            } catch (error) {
                console.error('Failed to fetch stats', error)
            } finally {
                setLoading(false)
            }
        }
        getStats()
    }, [token])

    if (loading) {
        return <Spinner animation="border" variant="primary" />
    }

    if (!stats) {
        return <p>Error loading stats. Please try again later.</p>
    }

    if (
        !stats.itemsCountByCategory ||
        Object.keys(stats.itemsCountByCategory).length === 0
    ) {
        return <p>No category data available.</p>
    }

    const generateColors = (count: number) => {
        const colors = []
        for (let i = 0; i < count; i++) {
            colors.push(`hsl(${(i * 360) / count}, 70%, 50%)`)
        }
        return colors
    }

    const pieChartData = {
        labels: Object.keys(stats.itemsCountByCategory),
        datasets: [
            {
                data: Object.values(stats.itemsCountByCategory),
                backgroundColor: generateColors(
                    Object.keys(stats.itemsCountByCategory).length
                ),
            },
        ],
    }

    return (
        <div>
            {/*<h2>Stats</h2>*/}
            <Row className="g-2 custom-row-spacing">
                {/* Cards for different stats */}
                <Col md={4}>
                    <Card className="text-center custom-card">
                        <Card.Body>
                            <i
                                className="bi bi-people-fill"
                                style={{ fontSize: '4rem', color: '#007bff' }}
                            ></i>
                            <Card.Title>Total Users</Card.Title>
                            <Card.Text>{stats.totalUsers}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center custom-card">
                        <Card.Body>
                            <i
                                className="bi bi-person-check-fill"
                                style={{ fontSize: '4rem', color: '#28a745' }}
                            ></i>
                            <Card.Title>Active Users</Card.Title>
                            <Card.Text>{stats.activeUsers}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center custom-card">
                        <Card.Body>
                            <i
                                className="bi bi-person-x-fill"
                                style={{ fontSize: '4rem', color: '#dc3545' }}
                            ></i>
                            <Card.Title>Frozen Users</Card.Title>
                            <Card.Text>{stats.frozenUsers}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center custom-card">
                        <Card.Body>
                            <i
                                className="bi bi-boxes"
                                style={{ fontSize: '4rem', color: '#ffc107' }}
                            ></i>
                            <Card.Title>Total Categories</Card.Title>
                            <Card.Text>{stats.totalCategories}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center custom-card">
                        <Card.Body>
                            <i
                                className="bi bi-cart-fill"
                                style={{ fontSize: '4rem', color: '#17a2b8' }}
                            ></i>
                            <Card.Title>Total Items</Card.Title>
                            <Card.Text>{stats.totalItems}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Pie Chart for itemsCountByCategory */}
            <Row className="mt-4">
                <Col md={6}>
                    <h4 className={'text-success fw-bolder'}>
                        Items by Category
                    </h4>
                    <div style={{ maxWidth: '100%', height: '90%' }}>
                        <Pie
                            data={pieChartData}
                            options={{
                                maintainAspectRatio: true,
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: (context) =>
                                                `${context.label}: ${context.raw}`,
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default Stats
