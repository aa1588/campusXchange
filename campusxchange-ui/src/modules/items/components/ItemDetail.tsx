import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ItemService from '../service/itemservice'
import QuestionService from '../service/QuestionService'
import { Carousel, Card, Row, Col, Button, Form } from 'react-bootstrap'
import LayoutHeading from '../../../layout/LayoutHeading'

const ItemDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [itemDetails, setItemDetails] = useState<any>(null)
    const [questions, setQuestions] = useState<any[]>([])
    const [newQuestion, setNewQuestion] = useState<string>('')
    const [answerText, setAnswerText] = useState<{ [key: number]: string }>({})
    const navigate = useNavigate()
    const [ownerLoggedIn, setOwnerLoggedIn] = useState<boolean>(false)

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

        fetchItemDetails()
        fetchQuestions()
    }, [id])

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

    if (!itemDetails) {
        return <div>Loading...</div>
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
                <Col md={8} className="d-flex">
                    <Card className="flex-fill">
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
                                        {/* Check if answers exist and have a length > 0 */}
                                        {q.answers && q.answers.length > 0 ? (
                                            // Display the answer if it exists
                                            <div>
                                                <strong>A:</strong>{' '}
                                                {q.answers[0].answerText} <br />
                                                <small>
                                                    Answered by:{' '}
                                                    {q.answers[0].answeredBy}
                                                </small>
                                            </div>
                                        ) : ownerLoggedIn ? (
                                            // Display input to post an answer if none exists
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
                                    <hr />{' '}
                                    {/* This line will separate each Q&A */}
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
        </div>
    )
}

export default ItemDetail
