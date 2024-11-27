import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ItemService from '../service/itemservice';
import QuestionService from '../service/QuestionService';
import OfferService from '../service/OfferService';
import { Carousel, Card, Row, Col, Button, Form, Modal, Tabs, Tab, Table } from 'react-bootstrap';
import LayoutHeading from '../../../layout/LayoutHeading';
import itemservice from '../service/itemservice';
import Cookies from 'js-cookie';

const ItemDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [itemDetails, setItemDetails] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [newQuestion, setNewQuestion] = useState<string>("");
    const [answerText, setAnswerText] = useState<{ [key: number]: string }>({});
    const navigate = useNavigate();
    const [ownerLoggedIn, setOwnerLoggedIn] = useState<boolean>(false);
    const [showOfferModal, setShowOfferModal] = useState<boolean>(false);
    const [offerAmount, setOfferAmount] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [myitems, setMyitems] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: number }>({});
    const [activeTab, setActiveTab] = useState<string>("offer");
    const [existingOffer, setExistingOffer] = useState<any | null>(null);

    useEffect(() => {
        const fetchItemDetails = async () => {
            if (id) {
                const item = await ItemService.getItemById(parseInt(id));
                setItemDetails(item);
                const userId = JSON.parse(localStorage.getItem("user") || "{}").userId;
                if (item && item.listed_by === userId) {
                    setOwnerLoggedIn(true);
                }
            }
        };

        fetchMyItems();
        fetchItemDetails();
        fetchQuestions();
        fetchExistingOffer();
    }, [id]);

    const fetchMyItems = async () => {
        const token = Cookies.get('authToken');
        const myItems = await itemservice.fetchItemsByUser(token);
        setMyitems(myItems);
    };

    const fetchQuestions = async () => {
        const fetchedQuestions = await QuestionService.getAllQuestionAnswerByItemId(parseInt(id ?? '0'));
        setQuestions(fetchedQuestions.data);
    };

    const fetchExistingOffer = async () => {
        const fetchedOffer = await OfferService.getOfferForItem(parseInt(id ?? "0"));
        setExistingOffer(fetchedOffer.length > 0 ? fetchedOffer[0] : null);
    };


    const handleQuestionSubmit = async () => {
        if (!newQuestion.trim()) return;
        await QuestionService.postQuestion(parseInt(id ?? '0'), newQuestion);
        setNewQuestion("");
        fetchQuestions(); // Refresh the list of questions and answers
    };

    const handleAnswerSubmit = async (questionId: number) => {
        const answer = answerText[questionId]?.trim();
        if (!answer) return;

        await QuestionService.postAnswerForAQuestion(questionId, answer);
        setAnswerText((prev) => ({ ...prev, [questionId]: "" }));
        fetchQuestions(); // Refresh the list of questions and answers
    };

    const toggleTradeItemSelection = async (itemid : number) => {
        debugger;
    }

    const updateItemQuantity = (itemId: number, quantity: number) => {
        setSelectedItems((prev) => ({
            ...prev,
            [itemId]: quantity,
        }));
    };

    const openOfferModal = (isEdit = false) => {
        if (isEdit && existingOffer) {
            // Prepopulate the modal fields for editing
            setOfferAmount(existingOffer.amount.toString());
            setActiveTab(existingOffer.offerType.toLowerCase());
            if (existingOffer.offerType === "TRADE") {
                const tradeItems = existingOffer.offerItems.reduce((acc: any, item: any) => {
                    acc[item.itemId] = item.quantity;
                    return acc;
                }, {});
                setSelectedItems(tradeItems);
            }
        } else {
            // Reset the modal fields for new offer
            setOfferAmount("");
            setSelectedItems({});
            setActiveTab("offer");
        }
        setShowOfferModal(true);
    };

    const handleOfferSubmit = async () => {
        if (!offerAmount.trim()) {
            alert("Please enter an amount.");
            return;
        }

        const parsedAmount = parseFloat(offerAmount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert("Please enter a valid amount greater than 0.");
            return;
        }

        setLoading(true);

        try {
            const formData: any = { amount: parsedAmount };

            if (activeTab === "trade") {
                const offerItems = Object.entries(selectedItems).map(([itemId, quantity]) => ({
                    itemId: parseInt(itemId),
                    quantity,
                }));
                formData.offerItems = offerItems;
                formData.offerType = "TRADE";
            } else {
                formData.offerType = "OFFER";
            }

            await OfferService.makeAnOffer(parseInt(id ?? "0"), formData);
            setShowOfferModal(false);
            setOfferAmount("");
            setSelectedItems({});
            fetchExistingOffer(); // Refresh the existing offer after submission
        } catch (error) {
            console.error("Error submitting offer:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!itemDetails) {
        return <div>Loading...</div>;
    }

    const toggleItemSelection = (itemId: number, checked: boolean) => {
        setSelectedItems((prev) => {
            const updated = { ...prev };
            if (checked) {
                updated[itemId] = 1; // Default quantity to 1 if checked
            } else {
                delete updated[itemId];
            }
            return updated;
        });
    };

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
                                <img className="d-block w-100" src={imageUrl} alt={`Slide ${index + 1}`} />
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
                                <strong>Created At:</strong> {new Date(itemDetails.createdAt).toLocaleString()}
                                <br />
                            </Card.Text>
                            {!ownerLoggedIn && (
                                <div>
                                    {existingOffer ? (
                                        <div>
                                            <h6 className="text-muted">Your Current Offer:</h6>
                                            <Table striped bordered hover>
                                                <tbody>
                                                    <tr>
                                                        <td>Amount</td>
                                                        <td>${existingOffer.amount}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Type</td>
                                                        <td>{existingOffer.offerType}</td>
                                                    </tr>
                                                    {existingOffer.offerType === "TRADE" && (
                                                        <tr>
                                                            <td>Trade Items</td>
                                                            <td>
                                                                {existingOffer.offerItems.map((item: any) => (
                                                                    <div key={item.itemId}>
                                                                        Item ID: {item.itemId}, Quantity: {item.quantity}
                                                                    </div>
                                                                ))}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                            <Button
                                                variant="warning"
                                                onClick={() => openOfferModal(true)}
                                                className="mt-2"
                                            >
                                                Edit Offer
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button variant="warning" onClick={() => openOfferModal(false)}>
                                            Make an Offer
                                        </Button>
                                    )}
                                </div>
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
                        <Button variant="primary" onClick={handleQuestionSubmit} className="mt-2">
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
                                                <strong>A:</strong> {q.answers[0].answerText} <br />
                                                <small>Answered by: {q.answers[0].answeredBy}</small>
                                            </div>
                                        ) : ownerLoggedIn ? (
                                            <Form.Group controlId={`answerInput-${q.questionId}`}>
                                                <Form.Label>Post an Answer:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Type your answer here"
                                                    value={answerText[q.questionId] || ""}
                                                    onChange={(e) =>
                                                        setAnswerText((prev) => ({
                                                            ...prev,
                                                            [q.questionId]: e.target.value,
                                                        }))
                                                    }
                                                />
                                                <Button
                                                    variant="success"
                                                    onClick={() => handleAnswerSubmit(q.questionId)}
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
            <Modal show={showOfferModal} onHide={() => setShowOfferModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{existingOffer ? "Edit Offer" : "Make an Offer"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(key) => setActiveTab(key ?? "offer")}
                        id="offer-tabs"
                        className="mb-3"
                    >
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
                                        checked={selectedItems[item.id] !== undefined}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            if (isChecked) {
                                                setSelectedItems((prev) => ({ ...prev, [item.id]: 1 }));
                                            } else {
                                                setSelectedItems((prev) => {
                                                    const newSelected = { ...prev };
                                                    delete newSelected[item.id];
                                                    return newSelected;
                                                });
                                            }
                                        }}
                                    />
                                    {selectedItems[item.id] !== undefined && (
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            max={item.quantity}
                                            value={selectedItems[item.id]}
                                            onChange={(e) =>
                                                setSelectedItems((prev) => ({
                                                    ...prev,
                                                    [item.id]: parseInt(e.target.value, 10),
                                                }))
                                            }
                                            className="mt-1"
                                        />
                                    )}
                                </div>
                            ))}
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowOfferModal(false)} disabled={loading}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleOfferSubmit} disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ItemDetail;
