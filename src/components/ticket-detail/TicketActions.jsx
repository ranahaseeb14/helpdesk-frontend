import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form } from 'react-bootstrap'

const allowedTransitions = {
    'Open': ['Assigned'],
    'Assigned': ['In Progress'],
    'In Progress': ['Resolved'],
    'Resolved': ['Closed']
}
function TicketActions({ ticket, user, ticketId, onUpdate }) {
    const [agents, setAgents] = useState([])

    async function fetchAgents() {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/agents`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setAgents(res.data.agents)
        } catch (error) {
            console.log(error)
        }
    }
    async function handleAssign(agentId) {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/tickets/${ticketId}/assign`, { agentId }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            onUpdate()
        } catch (error) {
            console.log(error)
        }
    }
    async function handleStatusChange(newStatus) {
        try {
            const token = localStorage.getItem('token')
            let resolutionNote = ""
            if (newStatus === 'Resolved') {
                resolutionNote = prompt("Please Write Resolution Note:")
                if (!resolutionNote) return
            }
            const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/tickets/${ticketId}/status`, { status: newStatus, resolutionNote }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            onUpdate()
        } catch (error) {
            console.log(error)
        }
    }
    async function handlePriorityChange(newPriority) {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/tickets/${ticketId}/priority`, { priority: newPriority }, { headers: { Authorization: `Bearer ${token}` } })
            onUpdate()
        } catch (error) {
            console.log(error)
        }
    }
    async function handleReopen() {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/tickets/${ticketId}/reopen`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            onUpdate()
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchAgents()
    }, [])
    const isAssignedAgent = user.role === 'agent' && ticket.assignedAgent === user._id
    const isAdmin = user.role === 'admin'

    return (
        <div>
            {(isAdmin || isAssignedAgent) && ticket.status !== 'Closed' && (
                <div>
                    <h4>Change Status:</h4>
                    {allowedTransitions[ticket.status]?.map((nextStatus) => (
                        <Button key={nextStatus} onClick={() => handleStatusChange(nextStatus)} className="me-2">
                            Mark as {nextStatus}
                        </Button>
                    ))}
                </div>
            )}
            {(isAdmin || isAssignedAgent) && (
                <div>
                    <h4>Priority: {ticket.priority}</h4>
                    <Form.Select onChange={(e) => handlePriorityChange(e.target.value)} defaultValue="">
                        <option value="" disabled>Change Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </Form.Select>
                </div>
            )}
            {isAdmin && ticket.status !== 'Closed' && (
                <div>
                    <h4>Assign Agent:</h4>
                    <Form.Select onChange={(e) => handleAssign(e.target.value)} defaultValue="">
                        <option value="" disabled>Select Agent</option>
                        {agents.map((agent) => (
                            <option key={agent._id} value={agent._id}>{agent.name}</option>
                        ))}
                    </Form.Select>
                </div>
            )}
            {ticket.status === 'Closed' && (user._id === ticket.requester || isAdmin) && (
                <Button variant='warning' onClick={handleReopen} className="mt-2">
                    Reopen Ticket
                </Button>
            )}
        </div>
    )
}

export default TicketActions
