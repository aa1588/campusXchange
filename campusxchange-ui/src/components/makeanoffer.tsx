import React, { useState } from 'react'
import { Button, Modal, Form, InputGroup } from 'react-bootstrap'

const App: React.FC = () => {
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    return (
        <div className="App">
            {/* Make an Offer Button */}
            <Button variant="primary" onClick={handleShow}>
                Make an Offer
            </Button>

            {/* Popup Modal */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Make an Offer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Offer Price Input */}
                    <Form.Group className="mb-3">
                        <Form.Label>OFFER PRICE</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control
                                type="number"
                                placeholder="325.00"
                                defaultValue="325.00"
                            />
                        </InputGroup>
                    </Form.Group>

                    {/* Comments Input */}
                    <Form.Group className="mb-3">
                        <Form.Label>COMMENTS</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            defaultValue={`Hello, Offer Up sells this product for $300.\nBut I'd rather purchase it from you.\nCan you accept $325?`}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleClose}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default App
