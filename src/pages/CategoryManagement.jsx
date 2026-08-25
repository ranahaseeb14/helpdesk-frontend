import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Form, Button, Table } from 'react-bootstrap'
import Navbar from '../components/Navbar'

function CategoryManagement() {
    const [category, setCategory] = useState([])
    const [categoryName, setCategoryName] = useState("")
    async function fetchCategory() {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCategory(res.data.categories)
        } catch (error) {
            console.log(error)
        }
    }
    async function handleCreateCategory(e) {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, { name: categoryName }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCategoryName("")
            fetchCategory()
        } catch (error) {
            console.log(error)
        }
    }
    async function handleDeleteCategory(id) {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchCategory()
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchCategory()
    }, [])
    return (
        <div className='container mt-4'>
            <Navbar />
            <h2 className='mt-3'>Category Management</h2>
            <Form onSubmit={handleCreateCategory} className='d-flex gap-2 mt-3' style={{ maxWidth: '400px' }}>
                <Form.Control
                    type="text"
                    placeholder="New category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
                <Button type="submit">Add Category</Button>
            </Form>
            <Table>
                <thead>
                    <tr>
                        <th>Category Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {category.map((myCategories) => {
                        return (
                            <tr key={myCategories._id}>
                                <td>{myCategories.name}</td>
                                <td>
                                    <Button variant='danger' size='sm' onClick={() => handleDeleteCategory(myCategories._id)}>Delete</Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    )
}

export default CategoryManagement
