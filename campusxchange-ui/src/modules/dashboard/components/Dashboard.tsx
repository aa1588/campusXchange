import React, { useState, useEffect } from 'react'
import { Button, Card, Table, Container, Row, Col } from 'react-bootstrap'
import LayoutHeading from '../../../layout/LayoutHeading'
import { Item } from '../../items/model/Item'
import Cookies from 'js-cookie'
import ItemService from '../../items/service/itemservice'
import { Link } from 'react-router-dom'
import AddItemForSale from '../../items/components/AddItemForm'

interface Offer {
    id: number
    from: string
    contact: string
    offerPrice: number
}

const Dashboard: React.FC = () => {
    const [items, setItems] = useState<Item[]>([])
    const [error, setError] = useState<string | null>(null)
    const [showAddItemModal, setShowAddItemModal] = useState(false) // State for modal visibility

    const offers: Offer[] = [
        {
            id: 1,
            from: 'sam@my.unt.edu',
            contact: 'Unavailable',
            offerPrice: 325.0,
        },
    ]

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token: string | undefined = Cookies.get('authToken')
                const data = await ItemService.fetchItemsByUser(token) // Use the service
                setItems(data)
            } catch (err: any) {
                setError(err.message)
            }
        }

        fetchItems()
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

                <Row>
                    <LayoutHeading
                        heading={'Offers'}
                        color={'text-success'}
                        content={'Check offers on your listing.'}
                    />
                    <Col md={12}>
                        <Table bordered hover striped variant="light">
                            <thead className="thead-light">
                                <tr>
                                    <th className="text-white bg-success">
                                        Id
                                    </th>
                                    <th className="text-white bg-success">
                                        FROM
                                    </th>
                                    <th className="text-white bg-success">
                                        CONTACT
                                    </th>
                                    <th className="text-white bg-success">
                                        OFFER PRICE
                                    </th>
                                    <th className="text-white bg-success">
                                        ACTION
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {offers.map((offer) => (
                                    <tr key={offer.id}>
                                        <td>{offer.id}</td>
                                        <td>{offer.from}</td>
                                        <td>{offer.contact}</td>
                                        <td>${offer.offerPrice.toFixed(2)}</td>
                                        <td>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                className="me-2"
                                            >
                                                Accept
                                            </Button>
                                            <Button variant="danger" size="sm">
                                                Decline
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>

                {/*<Row className="mt-4">*/}
                {/*    <LayoutHeading heading={'My Listing'} color={'text-success'} content={'Here you can view, edit, and manage all the items you have listed for sale. Keep track of your items, update their details, or remove them from the marketplace when they are sold.'}/>*/}
                {/*    {error && <p className="text-danger">{error}</p>}*/}
                {/*    {items.map((item) => (*/}
                {/*        <Col xs={12} sm={6} md={3} key={item.id} className="mb-4">*/}
                {/*            <Card className="h-100">*/}
                {/*                <Card.Img variant="top" src={item.imageUrls[0]} style={{ height: '150px', objectFit: 'cover' }} />*/}
                {/*                <Card.Body>*/}
                {/*                    <Card.Title className="text-truncate text-success fw-bold">{item.title}</Card.Title>*/}
                {/*                    <Card.Text className="small">*/}
                {/*                        <strong>Quantity:</strong> {item.quantity}<br />*/}
                {/*                        <strong>Description:</strong> {item.description.length > 50 ? `${item.description.slice(0, 50)}...` : item.description}<br />*/}
                {/*                        <strong>Price:</strong> ${item.price.toFixed(2)}<br />*/}
                {/*                        <strong>Category:</strong> {item.category}<br />*/}
                {/*                        <strong>Listed By:</strong> User ID {item.listed_by}<br />*/}
                {/*                        <strong>Created At:</strong> {new Date(item.createdAt).toLocaleString()}<br />*/}
                {/*                    </Card.Text>*/}
                {/*                    <div className="d-flex justify-content-between">*/}
                {/*                        <Button variant="primary" size="sm" ><Link to={`/items/${item.id}`} style={{ color: 'white', textDecoration: 'none' }}><i*/}
                {/*                            className="bi bi-eye me-1"></i></Link></Button>*/}
                {/*                        <Button variant="warning" size="sm"><Link to={`/edit-item/${item.id}`} style={{ color: 'white', textDecoration: 'none' }}>*/}
                {/*                            <i className="bi bi-pencil-square me-1"></i>*/}
                {/*                        </Link></Button>*/}
                {/*                        <Button variant="danger" size="sm" onClick={() => handleDeleteItem(item.id)}>*/}
                {/*                            <i className="bi bi-trash"></i>*/}
                {/*                        </Button>*/}
                {/*                    </div>*/}
                {/*                </Card.Body>*/}
                {/*            </Card>*/}
                {/*        </Col>*/}
                {/*    ))}*/}
                {/*</Row>*/}

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
