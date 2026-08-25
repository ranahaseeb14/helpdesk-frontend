import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form, Badge } from 'react-bootstrap'

function CommentSection({ ticketId, user }) {
    const [comments, setComments] = useState([])
    const [message, setMessage] = useState("")
    const [isInternal, setIsInternal] = useState(false)

    async function fetchComments() {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tickets/${ticketId}/comments`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setComments(res.data.comments)
        } catch (error) {
            console.log(error)
        }
    }
    async function submitHandler(e) {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tickets/${ticketId}/comments`, { message, isInternal }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMessage("")
            setIsInternal(false)
            fetchComments()
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchComments()
    }, [ticketId])
    return (
        <div>
            <Form onSubmit={submitHandler}>
                <Form.Label>Comment</Form.Label>
                <Form.Control
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                {(user.role === 'agent' || user.role === 'admin') && (
                    <Form.Switch
                        className='mt-2'
                        label="Internal Note"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                    />
                )}
                <Button variant='primary' type='submit'>addComment</Button>
            </Form>
            {comments.map((comment) => (
                <div key={comment._id}>
                    <p>
                        {comment.message}
                        {comment.isInternal && <Badge bg='warning' className='ms-2'>Internal</Badge>}
                    </p>
                </div>
            ))}
        </div>
    )
}

export default CommentSection
