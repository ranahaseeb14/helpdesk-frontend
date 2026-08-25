import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Card, Row, Col } from 'react-bootstrap'
import axios from 'axios'
function Dashboard() {
    const [stats, setStats] = useState(null)

    async function fetchStats() {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tickets/dashboard`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setStats(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchStats()
    }, [])
    return (
        <div className='container'>
            <Navbar />
            <div className='flex'>
                {stats && (
                    <Row className="g-3 mt-3">
                        <Col md={3}>
                            <Card bg="primary" text="white" className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>{stats.totalCount}</Card.Title>
                                    <Card.Text>Total Tickets</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card bg="danger" text="white" className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>{stats.openCount}</Card.Title>
                                    <Card.Text>Open</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card bg="success" text="white" className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>{stats.resolvedCount}</Card.Title>
                                    <Card.Text>Resolved</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card bg="warning" className="shadow-sm">
                                <Card.Body>
                                    <Card.Title>{stats.overdueCount}</Card.Title>
                                    <Card.Text>Overdue</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </div>
        </div>
    )
}

export default Dashboard
