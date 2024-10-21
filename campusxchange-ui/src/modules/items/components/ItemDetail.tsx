// ItemDetail.tsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ItemService from '../service/itemservice'
import { Carousel, Card, Row, Col, Button } from 'react-bootstrap'
import LayoutHeading from '../../../layout/LayoutHeading'

const ItemDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>() // Get the ID from the URL parameters
    const [itemDetails, setItemDetails] = useState<any>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchItemDetails = async () => {
            if (id) {
                const item = await ItemService.getItemById(parseInt(id)) // Fetch item details by ID
                setItemDetails(item)
            }
        }
        fetchItemDetails()
    }, [id])

    if (!itemDetails) {
        return <div>Loading...</div> // You can implement a loading spinner here
    }

    return (
        <div className="container mt-4">
            <Row>
                <LayoutHeading
                    heading={'Item Details'}
                    color={'text-success'}
                    content={'Check more information on this item.'}
                />
            </Row>
            <Row className="align-items-stretch">
                {' '}
                {/* Align items in the row */}
                {/* Carousel Column */}
                <Col md={4} className="d-flex">
                    <Carousel className="flex-fill">
                        {' '}
                        {/* Make carousel fill the column */}
                        {itemDetails.imageUrls.map(
                            (imageUrl: string, index: number) => (
                                <Carousel.Item key={index}>
                                    <img
                                        className="d-block w-100"
                                        src={imageUrl}
                                        alt={`Slide ${index + 1}`}
                                    />
                                </Carousel.Item>
                            )
                        )}
                    </Carousel>
                </Col>
                {/* Description Column */}
                <Col md={8} className="d-flex">
                    <Card className="flex-fill">
                        {' '}
                        {/* Make card fill the column */}
                        <Card.Body>
                            <Card.Title className="text-truncate fw-bold text-success">
                                {itemDetails.title}
                            </Card.Title>
                            <Card.Text>
                                <strong>Quantity:</strong>{' '}
                                {itemDetails.quantity}
                                <br />
                                <strong>Description:</strong>{' '}
                                {itemDetails.description}
                                <br />
                                <strong>Price:</strong> $
                                {itemDetails.price.toFixed(2)}
                                <br />
                                <strong>Category:</strong>{' '}
                                {itemDetails.category}
                                <br />
                                {/*<strong>Listed By:</strong> User ID {itemDetails.listed_by}<br />*/}
                                <strong>Created At:</strong>{' '}
                                {new Date(
                                    itemDetails.createdAt
                                ).toLocaleString()}
                                <br />
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

export default ItemDetail
