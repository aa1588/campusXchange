import React, { useState, useEffect } from 'react'
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    Spinner,
    Alert,
    Carousel,
} from 'react-bootstrap'
import { FaBook, FaChair, FaTv, FaCar, FaDumbbell } from 'react-icons/fa'

import './Home.css'

import axios from 'axios'
import ItemService from '../modules/items/service/itemservice'
import WishlistService from '../modules/items/service/WishlistService'
import Cookies from 'js-cookie'
import { number } from 'yup'

interface Item {
    id: number
    title: string
    price: string
    imageUrls: string[]
}

// Define the type for the props in ItemCard
interface ItemCardProps {
    item: Item
    onLike: (id: number) => void
    liked: boolean
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onLike, liked }) => {
    return (
        <Card style={{ width: '18rem', height: '30rem' }}>
            <Carousel>
                {item.imageUrls.map((image, index) => (
                    <Carousel.Item key={index}>
                        <img
                            className="d-block w-100"
                            src={image}
                            alt={`${item.title} image ${index + 1}`}
                            style={{ height: '200px', objectFit: 'cover' }} // Adjust the height as needed
                        />
                    </Carousel.Item>
                ))}
            </Carousel>
            <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.price}</Card.Text>
                <Button
                    onClick={() => onLike(item.id)}
                    variant={liked ? 'success' : 'dark'}
                >
                    {liked ? '💚' : '🖤'}
                </Button>
            </Card.Body>
        </Card>
    )
}

const CategoryFilter: React.FC<{
    selectedCategories: string[]
    onCategoryChange: (category: string) => void
}> = ({ selectedCategories, onCategoryChange }) => {
    const categories = [
        { name: 'TEXTBOOKS', icon: <FaBook /> },
        { name: 'FURNITURE', icon: <FaChair /> },
        { name: 'ELECTRONICS', icon: <FaTv /> },
        { name: 'CARS', icon: <FaCar /> },
        { name: 'FITNESS', icon: <FaDumbbell /> },
    ]

    return (
        <Card
            style={{
                backgroundColor: '#F6F0F0',
                padding: '20px',
                borderRadius: '10px',
            }}
        >
            <Card.Body>
                <h3 className="text-center">Category</h3>
                <Row>
                    {categories.map((category) => (
                        <Col xs={12} key={category.name} className="mb-3">
                            {' '}
                            {/* Each category takes the full row */}
                            <Form.Check
                                type="checkbox"
                                id={category.name.toLowerCase()}
                                label={
                                    <span
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {category.icon}
                                        <span style={{ marginLeft: '8px' }}>
                                            {category.name}
                                        </span>
                                    </span>
                                }
                                checked={selectedCategories.includes(
                                    category.name
                                )}
                                onChange={() => onCategoryChange(category.name)}
                                style={{ cursor: 'pointer' }} // Change cursor to pointer for better UX
                            />
                        </Col>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    )
}

const Pagination: React.FC<{
    currentPage: number
    onPageChange: (newPage: number) => void
}> = ({ currentPage, onPageChange }) => {
    return (
        <div className="d-flex justify-content-center">
            <Button
                variant="outline-secondary"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
            >
                PREV
            </Button>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                    key={num}
                    variant="outline-secondary"
                    className="mx-1"
                    onClick={() => onPageChange(num)}
                    active={num === currentPage}
                >
                    {num + 1}
                </Button>
            ))}
            <Button
                variant="outline-secondary"
                onClick={() => onPageChange(currentPage + 1)}
            >
                NEXT
            </Button>
        </div>
    )
}

const Home: React.FC = () => {
    const [items, setItems] = useState<Item[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [likedItems, setLikedItems] = useState<number[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]) // New state for selected categories

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            fetchAllItems();
            fetchWishlistItems();
            setLoading(false);
            
        }

        fetchItems()
    }, [currentPage, selectedCategories]) // Add selectedCategories to dependency array

    const fetchAllItems = async () => {
        try {
            const token = Cookies.get('authToken');
            const response = await ItemService.getAllItems(currentPage, selectedCategories, token);
            setItems(response.data.data);
        } catch (err) {
            handleError(err, 'Failed to fetch items');
        }
    };

    const fetchWishlistItems = async () => {
        try {
            const wishlistResponse = await WishlistService.getMyWishListItems();
            const myWishListItems = wishlistResponse.data.map((item: { id: number }) => item.id);
            setLikedItems(myWishListItems);
        } catch (err) {
            handleError(err, 'Failed to fetch wishlist items');
        }
    };

    const handleError = (err: unknown, defaultMessage: string) => {
        if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || defaultMessage);
        } else if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred');
        }
    };


    const handleLike = async (id: number) => {

        await WishlistService.addToWishList(id);

        setLikedItems((prevLiked) =>
            prevLiked.includes(id)
                ? prevLiked.filter((itemId) => itemId !== id)
                : [...prevLiked, id]
        )
    }

    const handleCategoryChange = (category: string) => {
        setSelectedCategories(
            (prevCategories) =>
                prevCategories.includes(category)
                    ? prevCategories.filter((c) => c !== category) // Remove category if already selected
                    : [...prevCategories, category] // Add category if not selected
        )
    }

    const filteredItems = items.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <Container>
            <Form.Control
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
            />

            <Row>
                <Col md={3}>
                    <CategoryFilter
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryChange}
                    />
                </Col>
                <Col md={9}>
                    <Card
                        style={{ backgroundColor: '#F6F0F0', padding: '20px' }}
                    >
                        {loading ? (
                            <Spinner animation="border" />
                        ) : error ? (
                            <Alert variant="danger">Error: {error}</Alert>
                        ) : filteredItems.length > 0 ? (
                            <Row>
                                {filteredItems.map((item) => (
                                    <Col md={4} key={item.id} className="mb-4">
                                        <ItemCard
                                            item={item}
                                            onLike={handleLike}
                                            liked={likedItems.includes(item.id)}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Alert variant="warning">No items found</Alert>
                        )}
                    </Card>
                </Col>
            </Row>
            <Pagination
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </Container>
    )
}

export default Home
