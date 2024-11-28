import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ItemService from '../service/itemservice'
import QuestionService from '../service/QuestionService'
import OfferService from '../service/OfferService'
import {
    Carousel,
    Card,
    Row,
    Col,
    Button,
    Form,
    Modal,
    Tabs,
    Tab,
    Table,
} from 'react-bootstrap'
import LayoutHeading from '../../../layout/LayoutHeading'
import itemservice from '../service/itemservice'
import Cookies from 'js-cookie'
import {Link} from "react-router-dom";

const ItemDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [itemDetails, setItemDetails] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [newQuestion, setNewQuestion] = useState<string>('');
    const [answerText, setAnswerText] = useState<{ [key: number]: string }>({});
    const navigate = useNavigate();
    const [ownerLoggedIn, setOwnerLoggedIn] = useState<boolean>(false);
    const [showOfferModal, setShowOfferModal] = useState<boolean>(false);
    const [offerAmount, setOfferAmount] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [myitems, setMyitems] = useState<any[]>([]);
    const [userHasMadeOffer, setUserHasMadeOffer] = useState<boolean>(false);
    const [userOfferDetails, setUserOfferDetails] = useState<any>(null);
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: number }>({});
    const [activeTab, setActiveTab] = useState<string>('offer');


    useEffect(() => {
        const fetchItemDetails = async () => {
            if (id) {
                const item = await ItemService.getItemById(parseInt(id))
                setItemDetails(item)
                const userId = JSON.parse(
                    localStorage.getItem('user') || '{}'
                ).userId
                if (item && item.listed_by === userId) {
                    setOwnerLoggedIn(true)
                }
            }
        }
        checkUserOfferStatus()
        fetchMyItems()
        fetchItemDetails()
        fetchQuestions()
    }, [id])

    const checkUserOfferStatus = async () => {
        const offers = await OfferService.getOfferForItem(parseInt(id!));
        const userId = JSON.parse(localStorage.getItem('user') || '{}').userId;

        const userOffer = offers.find((offer: any) => offer.offeredBy.id === userId);

        if (userOffer) {
            setUserHasMadeOffer(true);
            setUserOfferDetails(userOffer);
        } else {
            setUserHasMadeOffer(false);
            setUserOfferDetails(null);
        }
    };
    

    const fetchMyItems = async () => {
        const token = Cookies.get('authToken')
        const myItems = await itemservice.fetchItemsByUser(token)
        setMyitems(myItems)
    }

    const fetchQuestions = async () => {
        const fetchedQuestions =
            await QuestionService.getAllQuestionAnswerByItemId(
                parseInt(id ?? '0')
            )
        setQuestions(fetchedQuestions.data)
    }

    const handleQuestionSubmit = async () => {
        if (!newQuestion.trim()) return
        await QuestionService.postQuestion(parseInt(id ?? '0'), newQuestion)
        setNewQuestion('')
        fetchQuestions() // Refresh the list of questions and answers
    }

    const handleAnswerSubmit = async (questionId: number) => {
        const answer = answerText[questionId]?.trim()
        if (!answer) return

        await QuestionService.postAnswerForAQuestion(questionId, answer)
        setAnswerText((prev) => ({ ...prev, [questionId]: '' }))
        fetchQuestions() // Refresh the list of questions and answers
    }

    const updateItemQuantity = (itemId: number, quantity: number) => {
        setSelectedItems((prev) => ({
            ...prev,
            [itemId]: quantity,
        }))
    }

    const handleOfferSubmit = async () => {
        if (!offerAmount.trim()) {
            alert('Please enter an amount.');
            return;
        }
    
        const parsedAmount = parseFloat(offerAmount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert('Please enter a valid amount greater than 0.');
            return;
        }
    
        setLoading(true);
    
        try {
            const formData: any = {
                amount: parsedAmount,
                offerType: activeTab === 'offer' ? 'OFFER' : 'TRADE',
            };
    
            if (activeTab === 'trade') {
                const offerItems = Object.entries(selectedItems).map(
                    ([itemId, quantity]) => ({
                        itemId: parseInt(itemId),
                        quantity,
                    })
                );
                formData.offerItems = offerItems;
            }

            let response;
    
            if(userOfferDetails != null){
                response =  await OfferService.updateOffer(parseInt(userOfferDetails.id ?? '0'), formData);
            }
            else{
                response = await OfferService.makeAnOffer(parseInt(id ?? '0'), formData);

            }
    
            // Update the UI immediately after a successful offer submission
            setUserHasMadeOffer(true);
            setUserOfferDetails(response.data);
    
            setShowOfferModal(false);
            setOfferAmount('');
            setSelectedItems({});
        } catch (error) {
            console.error('Error submitting offer:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleEditOffer = (offerDetails: any) => {
        // Set the existing offer details in the state
        setOfferAmount(offerDetails.amount.toString());
        setSelectedItems(
            offerDetails.offerItems.reduce((acc: any, item: any) => {
                acc[item.itemId] = item.quantity;
                return acc;
            }, {})
        );
    
        // Set the active tab based on the offerType
        setActiveTab(offerDetails.offerType === "TRADE" ? "trade" : "offer");
    
        // Open the modal to edit the offer
        setShowOfferModal(true);
    };
    
    

    if (!itemDetails) {
        return <div>Loading...</div>
    }

    const toggleItemSelection = (itemId: number, checked: boolean) => {
        setSelectedItems((prev) => {
            const updated = { ...prev }
            if (checked) {
                updated[itemId] = 1 // Default quantity to 1 if checked
            } else {
                delete updated[itemId]
            }
            return updated
        })
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
                <Col md={4} className="d-flex">
                    <Carousel className="flex-fill">
                        {itemDetails.imageUrls.map((imageUrl: string, index: number) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100"
                                    src={imageUrl}
                                    alt={`Slide ${index + 1}`}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Col>
                <Col md={8} className="d-flex">
                    <Card className="flex-fill">
                        <Card.Body>
                            <Card.Title className="text-truncate fw-bold text-success">
                                {itemDetails.title}
                            </Card.Title>
                            <Card.Text>
                                <strong>Quantity:</strong> {itemDetails.quantity}
                                <br />
                                <strong>Description:</strong> {itemDetails.description}
                                <br />
                                <strong>Price:</strong> ${itemDetails.price.toFixed(2)}
                                <br />
                                <strong>Category:</strong> {itemDetails.category}
                                <br />
                                <strong>Created At:</strong>{' '}
                                {new Date(itemDetails.createdAt).toLocaleString()}
                                <br />
                            </Card.Text>
                            {!ownerLoggedIn && (
                                <>
                                    {!userHasMadeOffer ? (
                                        <Button
                                            variant="warning"
                                            onClick={() => setShowOfferModal(true)}
                                        >
                                            Make an Offer
                                        </Button>
                                    ) : (
                                        userOfferDetails && (
                                            <div className="mt-4">
                                                <h5>Your Offer Details</h5>
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            <th>Offer ID</th>
                                                            <th>Amount</th>
                                                            <th>Offer Type</th>
                                                            <th>Offer Items</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>{userOfferDetails.id}</td>
                                                            <td>${userOfferDetails.amount.toFixed(2)}</td>
                                                            <td>{userOfferDetails.offerType}</td>
                                                            <td>
                                                                {userOfferDetails.offerItems && userOfferDetails.offerItems.length > 0 ? (
                                                                    <ul>
                                                                        {userOfferDetails.offerItems.map((item: any) => (
                                                                            <li key={item.itemId}>
                                                                                <Link to={`/items/${item.itemId}`} target="_blank">
                                                                                    {item.itemId}
                                                                                </Link> - Quantity: {item.quantity}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    'N/A'
                                                                )}
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    variant="info"
                                                                    onClick={() => handleEditOffer(userOfferDetails)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>
                                        )
                                    )}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Q&A Section */}
            <Row className="mt-4">
                <Col>
                    <h5>Questions & Answers</h5>
                    <Form.Group controlId="questionInput">
                        <Form.Label>Ask a Question:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Type your question here"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                        />
                        <Button
                            variant="primary"
                            onClick={handleQuestionSubmit}
                            className="mt-2"
                        >
                            Submit Question
                        </Button>
                    </Form.Group>

                    <div className="mt-4">
                        {questions.length > 0 ? (
                            questions.map((q) => (
                                <div key={q.questionId} className="mb-3">
                                    <strong>Q:</strong> {q.questionText} <br />
                                    <small>Asked by: {q.askedBy}</small>
                                    <div className="ml-4 mt-2">
                                        {q.answers && q.answers.length > 0 ? (
                                            <div>
                                                <strong>A:</strong>{' '}
                                                {q.answers[0].answerText} <br />
                                                <small>
                                                    Answered by:{' '}
                                                    {q.answers[0].answeredBy}
                                                </small>
                                            </div>
                                        ) : ownerLoggedIn ? (
                                            <Form.Group
                                                controlId={`answerInput-${q.questionId}`}
                                            >
                                                <Form.Label>
                                                    Post an Answer:
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Type your answer here"
                                                    value={
                                                        answerText[
                                                            q.questionId
                                                        ] || ''
                                                    }
                                                    onChange={(e) =>
                                                        setAnswerText(
                                                            (prev) => ({
                                                                ...prev,
                                                                [q.questionId]:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                />
                                                <Button
                                                    variant="success"
                                                    onClick={() =>
                                                        handleAnswerSubmit(
                                                            q.questionId
                                                        )
                                                    }
                                                    className="mt-2"
                                                >
                                                    Submit Answer
                                                </Button>
                                            </Form.Group>
                                        ) : (
                                            <div></div>
                                        )}
                                    </div>
                                    <hr />
                                </div>
                            ))
                        ) : (
                            <p>No questions yet. Be the first to ask!</p>
                        )}
                    </div>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                </Col>
            </Row>

            {/* Offer Modal */}
            <Modal
                show={showOfferModal}
                onHide={() => setShowOfferModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{userOfferDetails ? 'Edit Offer' : 'Make an Offer'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(key) => setActiveTab(key ?? 'offer')}
                        id="offer-tabs"
                        className="mb-3"
                    >
                        {/* Offer Tab */}
                        <Tab eventKey="offer" title="Offer">
                            <Form.Group controlId="offerInput">
                                <Form.Label>Enter your offer amount:</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    placeholder="Enter amount"
                                    value={offerAmount}
                                    onChange={(e) => setOfferAmount(e.target.value)}
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Tab>

                        {/* Trade Tab */}
                        <Tab eventKey="trade" title="Trade">
                            <Form.Group controlId="tradeAmountInput">
                                <Form.Label>Enter your trade amount:</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    placeholder="Enter amount"
                                    value={offerAmount}
                                    onChange={(e) => setOfferAmount(e.target.value)}
                                    disabled={loading}
                                />
                            </Form.Group>
                            <p>Select items for trade:</p>
                            {myitems.map((item) => (
                                <div key={item.id} className="mb-2">
                                    <Form.Check
                                        type="checkbox"
                                        label={`${item.title} (Available: ${item.quantity})`}
                                        onChange={(e) =>
                                            toggleItemSelection(item.id, e.target.checked)
                                        }
                                    />
                                    {selectedItems[item.id] !== undefined && (
                                        <Form.Control
                                            type="number"
                                            placeholder="Quantity"
                                            min="1"
                                            max={item.quantity}
                                            value={selectedItems[item.id]}
                                            onChange={(e) =>
                                                updateItemQuantity(item.id, parseInt(e.target.value) || 1)
                                            }
                                            className="mt-2"
                                        />
                                    )}
                                </div>
                            ))}
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowOfferModal(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="success"
                        onClick={handleOfferSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                Submitting...
                            </>
                        ) : (
                            'Submit Offer'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ItemDetail