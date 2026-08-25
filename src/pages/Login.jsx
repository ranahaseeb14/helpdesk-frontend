import React, { useState } from 'react'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import axios from 'axios'
import { Form, Button, Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [authData, setAuthData] = useState({
        email: "",
        password: ""
    })
    function changeHandler(e) {
        const name = e.target.name
        const value = e.target.value
        setAuthData({ ...authData, [name]: value })
    }
    async function submitHandler(e) {
        e.preventDefault()
        if (!authData.email || !authData.password) {
            setError("Please fill in all fields")
            return
        }
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/login`, authData)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            setAuthData({
                email: "",
                password: ""
            })
            navigate('/dashboard')
        } catch (error) {
            setError(error.response?.data?.msg || "Something went wrong")
        }
    }
    return (
        <div className='container d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
            <Card className='shadow-sm' style={{ width: '100%', maxWidth: '500px' }}>
                <Card.Body className='p-4'>
                    <h2 className='text-center mb-4'>Login Here</h2>
                    <Form className='w-1/2 mx-auto' onSubmit={submitHandler}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="example@email.com" name='email' value={authData.email} onChange={changeHandler} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                            <Form.Label>Password</Form.Label>
                            <div className="d-flex align-items-center position-relative">
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    name='password'
                                    value={authData.password}
                                    onChange={changeHandler}
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '12px', cursor: 'pointer' }}
                                >
                                    {showPassword ? <BsEyeSlash /> : <BsEye />}
                                </span>
                            </div>
                        </Form.Group>
                        <p>Don't have an account? Please <Link to="/register">Register</Link></p>
                        <Button variant='success' type='submit'>Login</Button>
                        {error && <p className='text-danger mt-3'>{error}</p>}
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Login
