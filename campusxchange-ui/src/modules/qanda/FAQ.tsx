import React from 'react'
import { Accordion, Card } from 'react-bootstrap'

const FAQ: React.FC = () => {
    return (
        <div className="container my-5">
            <h2>Frequently Asked Questions</h2>
            <Accordion defaultActiveKey="0">
                {/* Question 1 */}
                <Accordion.Item eventKey="0">
                    <Accordion.Header>What is Bootstrap?</Accordion.Header>
                    <Accordion.Body>
                        Bootstrap is a free and open-source CSS framework
                        directed at responsive, mobile-first front-end web
                        development.
                    </Accordion.Body>
                </Accordion.Item>

                {/* Question 2 */}
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        How does Bootstrap's grid system work?
                    </Accordion.Header>
                    <Accordion.Body>
                        Bootstrap’s grid system uses a series of containers,
                        rows, and columns to layout and align content. It’s
                        built with flexbox and is fully responsive.
                    </Accordion.Body>
                </Accordion.Item>

                {/* Question 3 */}
                <Accordion.Item eventKey="2">
                    <Accordion.Header>
                        What are Bootstrap components?
                    </Accordion.Header>
                    <Accordion.Body>
                        Bootstrap components are pre-styled user interface
                        elements such as buttons, cards, navbars, and modals
                        that are built with HTML, CSS, and JavaScript.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}

export default FAQ
