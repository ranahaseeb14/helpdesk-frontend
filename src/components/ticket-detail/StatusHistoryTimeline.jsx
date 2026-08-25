import axios from 'axios'
import React, { useEffect, useState } from 'react'

function StatusHistoryTimeline({ ticketId }) {
    const [history, setHistory] = useState([])

    async function fetchHistory() {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tickets/${ticketId}/status-history`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setHistory(res.data.history)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchHistory()
    }, [ticketId])
    return (
        <div>
            <h4>Status History</h4>
            {history.map((entry) => (
                <p key={entry._id}>
                    {entry.oldStatus} → {entry.newStatus} by {entry.changedBy?.name || "Unknown"}
                    {" "}({new Date(entry.createdAt).toLocaleString()})
                </p>
            ))}
        </div>
    )
}

export default StatusHistoryTimeline
