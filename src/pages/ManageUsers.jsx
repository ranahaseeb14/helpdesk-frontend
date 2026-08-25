import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Form, Badge, Table } from 'react-bootstrap'
import Navbar from '../components/Navbar'

function ManageUsers() {
    const [users, setUsers] = useState([])
    async function fetchUsers() {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUsers(res.data.users)
        } catch (error) {
            console.log(error)
        }
    }
    async function handleRoleChange(userId, newRole) {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/role`, { role: newRole }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchUsers()
        } catch (error) {
            console.log(error)
        }
    }
    function getRoleColor(role) {
        if (role === 'admin') return 'danger'
        if (role === 'agent') return 'primary'
        return 'secondary'
    }
    useEffect(() => {
        fetchUsers()
    }, [])
    return (
        <div className='container mt-4'>
            <Navbar />
            <h2 className='mt-3'>Manage Users</h2>
            <Table striped bordered hover responsive className='mt-3'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Current Role</th>
                        <th>Change Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((myUsers) => {
                        return (
                            <tr key={myUsers._id}>
                                <td>{myUsers.name}</td>
                                <td>{myUsers.email}</td>
                                <td><Badge bg={getRoleColor(myUsers.role)}>{myUsers.role}</Badge></td>
                                <td>
                                    <Form.Select onChange={(e) => handleRoleChange(myUsers._id, e.target.value)} defaultValue="" size='sm'>
                                        <option value="" disabled>Change Role</option>
                                        <option value="requester">Requester</option>
                                        <option value="agent">Agent</option>
                                        <option value="admin">Admin</option>
                                    </Form.Select>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    )
}

export default ManageUsers
