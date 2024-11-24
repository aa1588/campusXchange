import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Form, Container } from 'react-bootstrap'
import { BACKEND_BASE_URL } from '../config/config'

// Define the type for the categories
type Category = string

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([])

    // Fetch categories from the API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get<Category[]>(
                    `${BACKEND_BASE_URL}/api/categories`,
                    {
                        headers: {
                            Authorization: `Bearer YOUR_TOKEN_HERE`,
                        },
                    }
                )
                setCategories(response.data)
            } catch (error) {
                console.error('Error fetching categories', error)
            }
        }

        fetchCategories()
    }, [])

    // Handle checkbox change
    const handleCheckboxChange = (category: Category) => {
        setSelectedCategories((prevState) =>
            prevState.includes(category)
                ? prevState.filter((item) => item !== category)
                : [...prevState, category]
        )
    }

    return (
        <Container>
            <h3>Select Categories</h3>
            <Form>
                {categories.map((category, index) => (
                    <Form.Check
                        key={index}
                        type="checkbox"
                        label={category}
                        onChange={() => handleCheckboxChange(category)}
                        checked={selectedCategories.includes(category)}
                    />
                ))}
            </Form>
        </Container>
    )
}

export default Categories
