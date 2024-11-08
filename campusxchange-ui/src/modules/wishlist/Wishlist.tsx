import React, { useState, useEffect } from 'react'
import LayoutHeading from '../../layout/LayoutHeading'
import WishlistService from '../../modules/items/service/WishlistService'
import axios from 'axios'
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

interface Item {
    id: number
    title: string
    price: string
    imageUrls: string[]
}

// Define the type for the props in ItemCard
interface ItemCardProps {
    item: Item
    onDislike: (id: number) => void
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onDislike }) => {
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
                <Button onClick={() => onDislike(item.id)} variant="success">
                    💚
                </Button>
            </Card.Body>
        </Card>
    )
}

const Wishlist: React.FC = () => {
    const [likedItems, setLikedItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true)
            fetchWishlistItems()
            setLoading(false)
        }

        fetchItems()
    }, [likedItems])

    const fetchWishlistItems = async () => {
        try {
            const wishlistResponse = await WishlistService.getMyWishListItems()
            const myWishListItems = wishlistResponse.data.map((item: any) => ({
                id: item.id,
                title: item.title,
                price: item.price,
                imageUrls: item.imageUrls || [], // Fallback to an empty array if imageUrls is missing
            }))
            setLikedItems(myWishListItems)
        } catch (err) {
            handleError(err, 'Failed to fetch wishlist items')
        }
    }

    const handleError = (err: unknown, defaultMessage: string) => {
        if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || defaultMessage)
        } else if (err instanceof Error) {
            setError(err.message)
        } else {
            setError('An unknown error occurred')
        }
    }

    const handleDislike = async (id: number) => {
        await WishlistService.deleteFromMyWishlistItems(id)
    }

    return (
        <>
            <LayoutHeading
                heading={'Wishlist'}
                color={'text-success'}
                content={
                    'Add items to your wishlist to save them for later, get notified via email when price drop.'
                }
            />

            <Container>
                <Row>
                    <Col md={12}>
                        <Card
                            style={{
                                backgroundColor: '#F6F0F0',
                                padding: '20px',
                            }}
                        >
                            {loading ? (
                                <Spinner animation="border" />
                            ) : error ? (
                                <Alert variant="danger">Error: {error}</Alert>
                            ) : likedItems.length > 0 ? (
                                <Row>
                                    {likedItems.map((item) => (
                                        <Col
                                            md={4}
                                            key={item.id}
                                            className="mb-4"
                                        >
                                            <ItemCard
                                                item={item}
                                                onDislike={handleDislike}
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
            </Container>
        </>
    )
}

export default Wishlist
