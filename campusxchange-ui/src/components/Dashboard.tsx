import React from 'react';
import { Button, Card, Table, Container, Row, Col } from 'react-bootstrap';

// Define the type for Offer
interface Offer {
  id: number;
  from: string;
  contact: string;
  offerPrice: number;
}

const Dashboard: React.FC = () => {
  const offers: Offer[] = [
    {
      id: 1,
      from: 'sam@my.unt.edu',
      contact: 'Unavailable',
      offerPrice: 325.00,
    }
  ];

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Dashboard</h4>
            <Button variant="outline-success">Reset Password</Button>
          </div>
          <p>
            Easily manage or add your items on CampusXchange. You can review, accept or decline offers for your items here.
            Don't forget to mark your item as sold after the transaction is completed.
          </p>
          <Button variant="success" className="mb-4">Add Item For Sale +</Button>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src="laptop-image-url" alt="Laptop Image" />
            <Card.Body>
              <Card.Title>Dell Chromebook 3180</Card.Title>
              <Card.Text>
                16 GB RAM <br />
                15" TouchScreen <br />
                Webcam
              </Card.Text>
              <Button variant="primary" className="w-100">Mark Sold</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>FROM</th>
                <th>CONTACT</th>
                <th>OFFER PRICE</th>
                <th>ACTION</th>
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
                    <Button variant="success" size="sm" className="me-2">Accept</Button>
                    <Button variant="danger" size="sm">Decline</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
