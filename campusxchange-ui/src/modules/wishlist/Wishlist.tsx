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
    Spinner,
    Alert,
    Carousel,
} from 'react-bootstrap'
import { ToastUtil } from '../../utils/ToastUtils'
import { BACKEND_BASE_URL } from '../../config/config'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'

interface Item {
    id: number
    title: string
    price: string
    imageUrls: string[]
}

interface ItemCardProps {
    item: Item
    onDislike: (id: number) => void
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onDislike }) => {
    return (
            <Card
                style={{ width: '100%', maxWidth: '18rem', height: 'auto' }}
                className="shadow-sm"
            >
                <Link to={`/items/${item.id}`} style={{ textDecoration: 'none' }}>
                <Carousel>
                    {item.imageUrls.map((image, index) => (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100"
                                src={image}
                                alt={`${item.title} image ${index + 1}`}
                                style={{ height: '120px', objectFit: 'cover' }} // Adjust the height for better fit
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
                </Link>
                <Card.Body style={{ padding: '1rem' }}>
                    <Link to={`/items/${item.id}`} style={{ textDecoration: 'none' }}>
                    <Card.Title
                        style={{
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {item.title}
                    </Card.Title>
                    <Card.Text
                        style={{ fontSize: '1rem', color: '#666' }}
                        className={'fw-bolder'}
                    >
                        ${item.price}.00
                    </Card.Text>
                </Link>
                    <Button
                        onClick={() => onDislike(item.id)}
                        variant="outline-success"
                        size="sm"
                    >
                        💚
                    </Button>
                </Card.Body>
            </Card>
    )
}

const Wishlist: React.FC = () => {
    const [likedItems, setLikedItems] = useState<Item[]>([])
    const [recommendations, setRecommendations] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                await fetchWishlistItems();
                await fetchRecommendations();
            } catch (error) {
                console.error("Error fetching items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);


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

    const fetchRecommendations = async () => {
        try {
            const token: string | undefined = Cookies.get('authToken')
            const response = await axios.get(
                `${BACKEND_BASE_URL}/api/recommendations`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            const recommendationItems = response.data.map((item: any) => ({
                id: item.id,
                title: item.title,
                price: item.price,
                imageUrls: item.imageUrls || [], // Fallback to an empty array if imageUrls is missing
            }))
            setRecommendations(recommendationItems)
        } catch (err) {
            handleError(err, 'Failed to fetch recommendations')
        }
    }

    const handleDislike = async (id: number) => {
        try {
            await WishlistService.deleteFromMyWishlistItems(id)
            setLikedItems((prevItems) =>
                prevItems.filter((item) => item.id !== id)
            )
            ToastUtil.displayInfoToast('Wishlist Item removed.')
        } catch (error) {
            ToastUtil.displayErrorToast(
                'Failed to remove item from wishlist or recommendations.'
            )
        }
    }

    return (
        <>
            <LayoutHeading
                heading={'Wishlist'}
                color={'text-success'}
                content={
                    'Add items to your wishlist to save them for later, get recommendations of similar choices.'
                }
            />

            <Container>
                <Row>
                    <Col md={8}>
                        <Card
                            style={{
                                //backgroundColor: '#F6F0F0',
                                padding: '20px',
                            }}
                        >
                            {loading ? (
                                <Spinner animation="border" />
                            ) : error ? (
                                <Alert variant="danger">Error: {error}</Alert>
                            ) : likedItems.length > 0 ? (
                                <Row className={'column-gap-lg-0'}>
                                    {likedItems.map((item) => (
                                        <Col
                                            md={4}
                                            sm={6} // Responsive grid (columns shrink on smaller screens)
                                            key={item.id}
                                            className="mb-2"
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
                    {/* Recommendations Section */}
                    <Col md={4}>
                        <h4 className={'text-success'}>
                            CampusXchange Recommendations
                        </h4>
                        <p>
                            Discover more items that might interest you based on
                            your preferences. These
                            recommendations are handpicked to help you find what
                            you're looking for quickly and easily. Explore and
                            add new items to your wishlist today!
                        </p>{' '}
                        <Row>
                            {recommendations.length > 0 ? (
                                recommendations.map((item) => (
                                    <Col
                                        md={6}
                                        sm={12}
                                        key={item.id}
                                        className="mb-3"
                                    >
                                        <ItemCard
                                            item={item}
                                            onDislike={handleDislike}
                                        />
                                    </Col>
                                ))
                            ) : (
                                <Alert variant="warning">
                                    No recommendations found
                                </Alert>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Wishlist
