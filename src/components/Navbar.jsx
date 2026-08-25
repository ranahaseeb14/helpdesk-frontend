import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'

function Navbar() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))

    function logoutHandler() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/')
    }

    return (
        <div className="d-flex justify-content-between align-items-center p-3 bg-dark">
            <Link to="/dashboard" className="text-white text-decoration-none fs-4">Helpdesk System</Link>

            <div>
                <Link to="/tickets" className="text-white mx-2">Tickets</Link>

                {user.role === 'requester' && (
                    <Link to="/create-tickets" className="text-white mx-2">Create Ticket</Link>
                )}

                {user.role === 'admin' && (
                    <>
                        <Link to="/manage-users" className="text-white mx-2">Manage Users</Link>
                        <Link to="/manage-categories" className="text-white mx-2">Manage Categories</Link>
                    </>
                )}

                <Button variant="danger" size="sm" onClick={logoutHandler}>Logout</Button>
            </div>
        </div>
    )
}

export default Navbar