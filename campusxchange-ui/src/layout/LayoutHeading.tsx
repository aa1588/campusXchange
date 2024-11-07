import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

interface IProps {
    heading: string
    color: string
    icon?: string
    content?: string
}

const LayoutHeading: React.FC<IProps> = ({ heading, color, icon, content }) => {
    return (
        <>
            <Container className="mt-3">
                <Row>
                    <Col>
                        <p className={`h3 ${color}`}>
                            <i className={`bi ${icon}`}></i> {heading}
                        </p>
                        <p>{content}</p>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default LayoutHeading
