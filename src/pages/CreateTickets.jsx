import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Form, Button, Card, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import { theme } from '../theme'

function CreateTickets() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    const [error, setError] = useState("")
    const [categories, setCategories] = useState([])
    const [details, setDetails] = useState({
        title: "",
        description: "",
        category: "",
        priority: "",
        dueDate: ""
    })
    function changeHandler(e) {
        const name = e.target.name
        const value = e.target.value
        setDetails({ ...details, [name]: value })
    }
    async function fetchCategories() {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCategories(res.data.categories)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchCategories()
    }, [])
    async function submitHandler(e) {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tickets`, details, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setDetails({
                title: "",
                description: "",
                category: "",
                priority: ""
            })
            navigate('/dashboard')
        } catch (error) {
            setError(error.response?.data?.msg || "Something went wrong")
        }
    }
    return (
        <Layout>
            {loading ? (
                <div className="text-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Card className="border-0 shadow-sm mx-auto mt-4" style={{ maxWidth: '600px', borderRadius: '14px' }}>
                    <Card.Body className="p-4">
                        <h4 className='mb-4' style={{ color: theme.primary, fontWeight: 600 }}>Create Ticket</h4>
                        <Form onSubmit={submitHandler}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    style={{ borderRadius: '10px', border: `1px solid ${theme.border}` }}
                                    type="text" placeholder="Laptop Issue" name='title' value={details.title} onChange={changeHandler} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    style={{ borderRadius: '10px', border: `1px solid ${theme.border}` }}
                                    type='text' placeholder='Details ...'
                                    name='description' value={details.description} onChange={changeHandler}
                                    as="textarea" rows={3} />
                            </Form.Group>
                            <Form.Label>Categories</Form.Label>
                            <Form.Select name="category" value={details.category} onChange={changeHandler}>
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </Form.Select>
                            <Form.Label className='mt-3'>Priority</Form.Label>
                            <Form.Select name="priority" value={details.priority} onChange={changeHandler}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </Form.Select>
                            <Form.Group className="mb-3">
                                <Form.Label>Due Date (optional)</Form.Label>
                                <Form.Control
                                    style={{ borderRadius: '10px', border: `1px solid ${theme.border}` }}
                                    type="date"
                                    name="dueDate"
                                    value={details.dueDate}
                                    onChange={changeHandler}
                                />
                            </Form.Group>
                            <Button
                                type='submit'
                                className='mt-3'
                                style={{ backgroundColor: theme.accent, border: 'none', borderRadius: '10px', boxShadow: `0 2px 8px ${theme.accent}40` }}
                            >Create</Button>
                            {error && <p className='text-danger mt-3' style={{ fontSize: '14px' }}>{error}</p>}
                        </Form>
                    </Card.Body>
                </Card>
            )}
        </Layout>
    )
}

export default CreateTickets
