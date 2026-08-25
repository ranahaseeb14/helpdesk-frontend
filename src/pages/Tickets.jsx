import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Card, Badge, Row, Col } from 'react-bootstrap'


function Tickets() {
    const [tickets, setTickets] = useState([])
    async function fetchTickets() {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tickets`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setTickets(res.data.tickets)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchTickets()
    }, [])

    function getStatusColor(status) {
        if (status === 'Open') return 'danger'
        if (status === 'Assigned') return 'primary'
        if (status === 'In Progress') return 'warning'
        if (status === 'Resolved') return 'success'
        if (status === 'Closed') return 'secondary'
        return 'light'
    }
    function getPriorityColor(priority) {
        if (priority === 'Low') return 'success'
        if (priority === 'Medium') return 'warning'
        if (priority === 'High') return 'danger'
        return 'light'
    }
    return (
        <div className='container'>
            <Navbar />
            <Row className="g-3 mt-2">
                {tickets.map((myTickets) => (
                    <Col md={6} lg={4} key={myTickets._id}>
                        <Link to={`/ticket/${myTickets._id}`} className="text-decoration-none text-dark">
                            <Card className="shadow-sm h-100">
                                <Card.Body>
                                    <Card.Title className="fs-6">{myTickets.ticketNo}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{myTickets.title}</Card.Subtitle>
                                    <Badge bg={getStatusColor(myTickets.status)} className="me-2">{myTickets.status}</Badge>
                                    <Badge bg={getPriorityColor(myTickets.priority)}>{myTickets.priority}</Badge>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default Tickets
