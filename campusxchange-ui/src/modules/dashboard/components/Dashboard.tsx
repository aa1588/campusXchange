import React, { useState, useEffect } from 'react'
import { Button, Card, Table, Container, Row, Col, Modal } from 'react-bootstrap'
import LayoutHeading from '../../../layout/LayoutHeading'
import { Item } from '../../items/model/Item'
import Cookies from 'js-cookie'
import ItemService from '../../items/service/itemservice'
import { Link } from 'react-router-dom'
import AddItemForSale from '../../items/components/AddItemForm'
import OfferService from '../../items/service/OfferService'

interface Offer {
    id: number;
    amount: number;
    offeredBy: {
        email: string;
        phone: string;
    };
    item: {
        title: string;
        id: string;
    };
    status: string;
    offerType: string;
    offerItems: { itemId: number; quantity: number }[];
}

const Dashboard: React.FC = () => {
    const [items, setItems] = useState<Item[]>([])
    const [offers, setOffers] = useState<Offer[]>([])
    const [error, setError] = useState<string | null>(null)
    const [showAddItemModal, setShowAddItemModal] = useState(false) 
    const [selectedTrade, setSelectedTrade] = useState<Offer | null>(null)

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token: string | undefined = Cookies.get('authToken')
                const data = await ItemService.fetchItemsByUser(token)
                setItems(data)
            } catch (err: any) {
                setError(err.message)
            }
        }

        const fetchOffers = async () => {
            try {
                const token: string | undefined = Cookies.get('authToken')
                const offersData = await OfferService.getAllMyListingsOffer() // Fetch offers
                setOffers(offersData)
            } catch (err: any) {
                setError(err.message)
            }
        }

        fetchItems()
        fetchOffers() // Call fetchOffers to load the offers
    }, [])

    const handleDeleteItem = async (itemId: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const token: string | undefined = Cookies.get('authToken')
                await ItemService.deleteItem(itemId, token) // Call the delete method in your service

                // Update the state to remove the deleted item
                setItems((prevItems) =>
                    prevItems.filter((item) => item.id !== itemId)
                )
            } catch (err: any) {
                setError(err.message)
            }
        }
    }

    const handleOfferAction = async (offerId: number, action: string) => {
        try {
            const token: string | undefined = Cookies.get('authToken')
            if (action === 'accept') {
                await OfferService.acceptOffer(offerId)
            } else if (action === 'decline') {
                await OfferService.declineOffer(offerId)
            }
            const offersData = await OfferService.getAllMyListingsOffer()
            setOffers(offersData)
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleTradeClick = (offer: Offer) => {
        setSelectedTrade(offer)
    }

    const closeTradeModal = () => {
        setSelectedTrade(null)
    }

    // @ts-ignore
    return (
        <>
            <LayoutHeading
                heading={'Dashboard'}
                color={'text-success'}
                content={
                    '' +
                    'Easily manage or add your items on CampusXchange. You can review, accept or decline offers for your items here.\n' +
                    "                            Don't forget to mark your item as sold after the transaction is completed."
                }
            />
            <Container className="mt-4">
                <Row>
                    <Col>
                        <Link to="/add-item-for-sale">
                            <Button
                                variant="warning"
                                className="mb-4 p-2 text-white"
                            >
                                Add Item For Sale{' '}
                                <i className="bi bi-plus-circle-fill text-white"></i>
                            </Button>
                        </Link>
                    </Col>
                </Row>

                <Row className="mt-4">
                    <LayoutHeading
                        heading={'My Offers'}
                        color={'text-success'}
                        content={'Here you can review and manage offers for your listed items.'}
                    />

                    <Col md={4}>
                        <Card>
                            <Card.Img
                                variant="top"
                                src="laptop-image-url"
                                alt="Laptop Image"
                            />
                            <Card.Body>
                                <Card.Title>Dell Chromebook 3180</Card.Title>
                                <Card.Text>
                                    16 GB RAM <br />
                                    15" TouchScreen <br />
                                    Webcam
                                </Card.Text>
                                <Button variant="primary" className="w-100">
                                    Mark Sold
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    {error && <p className="text-danger">{error}</p>}
                    {offers.length === 0 ? (
                        <Col md={12}>
                            <p className="text-muted">You have no offers for your items.</p>
                        </Col>
                    ) : (
                        <Col md={12}>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Offer ID</th>
                                        <th>Item Title</th>
                                        <th>Amount</th>
                                        <th>Offered By (Email)</th>
                                        <th>Offered By (Phone)</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {offers.map((offer) => (
                                        <tr key={offer.id}>
                                            <td>{offer.id}</td>
                                            <td>
                                                <Link to={`/items/${offer.item.id}`} className="text-decoration-none">
                                                    {offer.item.title}
                                                </Link>
                                            </td>
                                            <td>${offer.amount.toFixed(2)}</td>
                                            <td>{offer.offeredBy.email}</td>
                                            <td>{offer.offeredBy.phone}</td>
                                            <td>
                                                {offer.offerType === 'TRADE' ? (
                                                    <Button
                                                        variant="link"
                                                        className="p-0"
                                                        onClick={() => handleTradeClick(offer)}
                                                    >
                                                        {offer.offerType}
                                                    </Button>
                                                ) : (
                                                    offer.offerType
                                                )}
                                            </td>
                                            <td>{offer.status}</td>
                                            <td>
                                                {offer.status !== 'ACCEPTED' && offer.status !== 'DECLINED' && (
                                                    <>
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            className="me-2"
                                                            onClick={() => handleOfferAction(offer.id, 'accept')}
                                                        >
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => handleOfferAction(offer.id, 'decline')}
                                                        >
                                                            Decline
                                                        </Button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    )}
                </Row>

                {/* Modal for Trade Details */}
                {selectedTrade && (
                    <Modal show onHide={closeTradeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Trade Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Item ID</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedTrade.offerItems.map((item) => (
                                        <tr key={item.itemId}>
                                            <td>
                                                <Link
                                                    to={`/items/${item.itemId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none text-primary"
                                                >
                                                    {item.itemId}
                                                </Link>
                                            </td>
                                            <td>{item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={closeTradeModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}

                <Row className="mt-1">
                    <LayoutHeading
                        heading={'My Listing'}
                        color={'text-success'}
                        content={
                            'Here you can view, edit, and manage all the items you have listed for sale. Keep track of your items, update their details, or remove them from the marketplace when they are sold.'
                        }
                    />
                    {error && <p className="text-danger">{error}</p>}
                    {items.length === 0 ? ( // Check if there are no items
                        <Col md={12}>
                            <p className="text-muted">
                                You have no items listed for sale. Please add
                                some items!
                            </p>
                        </Col>
                    ) : (
                        items.map((item) => (
                            <Col
                                xs={12}
                                sm={6}
                                md={3}
                                key={item.id}
                                className="mb-4"
                            >
                                <Card className="h-100">
                                    <Card.Img
                                        variant="top"
                                        src={item.imageUrls[0]}
                                        style={{
                                            height: '150px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <Card.Body className={'d-flex flex-column'}>
                                        <Card.Title className="text-truncate text-success fw-bold mt-4">
                                            {item.title}
                                        </Card.Title>
                                        <Card.Text className="small flex-grow-1">
                                            {/*<strong>Quantity:</strong> {item.quantity}<br />*/}
                                            {/*<strong>Description:</strong> {item.description.length > 50 ? `${item.description.slice(0, 50)}...` : item.description}<br />*/}
                                            <strong>Price:</strong> $
                                            {item.price.toFixed(2)}
                                            <br />
                                            <strong>Category:</strong>{' '}
                                            {item.category}
                                            <br />
                                            {/*<strong>Listed By:</strong> User ID {item.listed_by}<br />*/}
                                            {/*<strong>Created At:</strong> {new Date(item.createdAt).toLocaleString()}<br />*/}
                                        </Card.Text>
                                        <div className="d-flex justify-content-between">
                                            <Button variant="primary" size="sm">
                                                <Link
                                                    to={`/items/${item.id}`}
                                                    style={{
                                                        color: 'white',
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    <i className="bi bi-eye me-1"></i>
                                                </Link>
                                            </Button>
                                            <Button variant="warning" size="sm">
                                                <Link
                                                    to={`/edit-item/${item.id}`}
                                                    style={{
                                                        color: 'white',
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    <i className="bi bi-pencil-square me-1"></i>
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() =>
                                                    handleDeleteItem(item.id)
                                                }
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
            </Container>
        </>
    )
}

export default Dashboard
