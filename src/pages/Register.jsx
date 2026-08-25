import axios from 'axios'
import React, { useState } from 'react'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { Form, Button, Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [authData, setAuthData] = useState({
        name: "",
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
        if (!authData.name || !authData.email || !authData.password) {
            setError("Please fill in all fields")
            return
        }
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/register`, authData)
            setAuthData({
                name: "",
                email: "",
                password: ""
            })
            navigate('/')
        } catch (error) {
            setError(error.response?.data?.msg || "Something went wrong")
        }
    }
    return (
        <div className='container d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
            <Card className='shadow-sm' style={{ width: '100%', maxWidth: '500px' }}>
                <Card.Body className='p-4'>
                    <h2 className='text-center mb-4'>Register Here</h2>
                    <Form className='w-1/2 mx-auto' onSubmit={submitHandler}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="John Doe" name='name' value={authData.name} onChange={changeHandler} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="johndoe@email.com" name='email' value={authData.email} onChange={changeHandler} />
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
                        <p>Already have an account? <Link to="/">Login</Link></p>
                        <Button variant='success' type='submit'>Register</Button>
                        {error && <p className='text-danger mt-3'>{error}</p>}
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Register
