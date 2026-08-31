import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Badge, Spinner, Button, Row, Col } from 'react-bootstrap'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import { theme, getStatusStyle, getPriorityStyle } from '../theme'
import { BsSearch, BsPlusLg } from 'react-icons/bs'

function Tickets() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [priorityFilter, setPriorityFilter] = useState("")

    async function fetchTickets() {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tickets`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setTickets(res.data.tickets)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchTickets()
    }, [])
    const filteredTickets = tickets.filter((t) => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.ticketNo.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter ? t.status === statusFilter : true
        const matchesPriority = priorityFilter ? t.priority === priorityFilter : true
        return matchesSearch && matchesStatus && matchesPriority
    })
    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h4 style={{ color: theme.primary, fontWeight: 600 }}>Tickets</h4>
                {user.role === 'requester' && (
                    <Button
                        style={{ backgroundColor: theme.accent, border: 'none' }}
                        onClick={() => navigate('/create-tickets')}
                    >
                        <BsPlusLg className="me-1" /> Create Ticket
                    </Button>
                )}
            </div>
            <Row className="g-2 mb-4">
                <Col md={6}>
                    <div className="position-relative">
                        <BsSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.textMuted }} />
                        <Form.Control
                            placeholder="Search by title or ticket number..."
                            style={{ paddingLeft: '36px', borderRadius: '10px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </Col>
                <Col md={3}>
                    <Form.Select style={{ borderRadius: '10px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Select style={{ borderRadius: '10px' }} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                        <option value="">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </Form.Select>
                </Col>
            </Row>
            {loading ? (
                <div className="text-center mt-5">
                    <Spinner animation="border" style={{ color: theme.accent }} />
                </div>
            ) : filteredTickets.length === 0 ? (
                <p className="text-muted mt-4 text-center">No tickets match your filters.</p>
            ) : (
                <div className="d-flex flex-column gap-2">
                    {filteredTickets.map((t, index) => {
                        const statusStyle = getStatusStyle(t.status)
                        const priorityStyle = getPriorityStyle(t.priority)
                        return (
                            <motion.div
                                key={t._id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                whileHover={{ backgroundColor: '#f8fafc' }}
                            >
                                <Link to={`/ticket/${t._id}`} className="text-decoration-none text-dark">
                                    <div
                                        className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-3"
                                        style={{ border: `1px solid ${theme.border}`, borderRadius: '12px', backgroundColor: 'white' }}
                                    >
                                        <div>
                                            <div style={{ fontSize: '13px', color: theme.textMuted }}>{t.ticketNo}</div>
                                            <div style={{ fontWeight: 600, color: theme.primary }}>{t.title}</div>
                                        </div>
                                        <div className="d-flex gap-2 align-items-center">
                                            <Badge bg='null' style={{
                                                backgroundColor: priorityStyle.bg,
                                                color: priorityStyle.text,
                                                fontWeight: 500,
                                                fontSize: '13px',
                                                padding: '6px 12px',
                                                borderRadius: '8px'
                                            }}>
                                                {t.priority}
                                            </Badge>
                                            <Badge bg='null' style={{
                                                backgroundColor: statusStyle.bg,
                                                color: statusStyle.text,
                                                fontWeight: 500,
                                                fontSize: '13px',
                                                padding: '6px 12px',
                                                borderRadius: '8px'
                                            }}>
                                                {t.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </Layout>
    )
}

export default Tickets