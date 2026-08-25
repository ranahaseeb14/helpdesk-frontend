import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Badge } from 'react-bootstrap'
import Navbar from '../components/Navbar'
import CommentSection from '../components/ticket-detail/CommentSection'
import TicketActions from '../components/ticket-detail/TicketActions'
import StatusHistoryTimeline from '../components/ticket-detail/StatusHistoryTimeline'

function TicketDetail() {
    const user = JSON.parse(localStorage.getItem('user'))
    const { id } = useParams()
    const [ticket, setTicket] = useState(null)
    async function fetchTicket() {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tickets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setTicket(res.data.ticket)
        } catch (error) {
            console.log(error)
        }
    }
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
    useEffect(() => {
        fetchTicket()
    }, [id])
    return (
        <div className='container'>
            <Navbar />
            {ticket && (
                <>
                    <Card className='shadow-sm mb-3'>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h3>{ticket.ticketNo}</h3>
                                    <h5 className="text-muted">{ticket.title}</h5>
                                </div>
                                <div>
                                    <Badge bg={getStatusColor(ticket.status)} className="me-2 fs-6">{ticket.status}</Badge>
                                    <Badge bg={getPriorityColor(ticket.priority)} className="fs-6">{ticket.priority}</Badge>
                                </div>
                            </div>
                            <hr />
                            <p>{ticket.description}</p>

                            {ticket.dueDate && <p className="text-muted small">Due: {new Date(ticket.dueDate).toLocaleDateString()}</p>}
                            {ticket.resolution && (
                                <div className="alert alert-success mt-2">
                                    <strong>Resolution:</strong> {ticket.resolution}
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    <Card className='shadow-sm mb-3'>
                        <Card.Body>
                            <TicketActions ticket={ticket} user={user} ticketId={id} onUpdate={fetchTicket} />
                        </Card.Body>
                    </Card>
                    <Card className='shadow-sm mb-3'>
                        <Card.Body>
                            <StatusHistoryTimeline ticketId={id} />
                        </Card.Body>
                    </Card>
                    <Card className='shadow-sm'>
                        <Card.Body>
                            <CommentSection ticketId={id} user={user} />
                        </Card.Body>
                    </Card>
                </>
            )}
        </div>
    )
}
export default TicketDetail