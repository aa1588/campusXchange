import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, Carousel } from "react-bootstrap";
import axios from "axios";


import ItemService from "../services/itemservice";
import Cookies from "js-cookie";

// Define the type for each item
interface Item {
    id: number;
    title: string;
    price: string;
    imageUrls: string[];
  }
  

// Define the type for the props in ItemCard
interface ItemCardProps {
  item: Item;
  onLike: (id: number) => void;
  liked: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onLike, liked }) => {
    return (
      <Card style={{ width: '18rem', height: '30rem' }}>
        <Carousel>
          {item.imageUrls.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                src={image}
                alt={`${item.title} image ${index + 1}`}
                style={{ height: '200px', objectFit: 'cover' }} // Adjust the height as needed
              />
            </Carousel.Item>
          ))}
        </Carousel>
        <Card.Body>
          <Card.Title>{item.title}</Card.Title>
          <Card.Text>{item.price}</Card.Text>
          <Button onClick={() => onLike(item.id)} variant={liked ? "success" : "dark"}>
            {liked ? "💚" : "🖤"}
          </Button>
        </Card.Body>
      </Card>
    );
  };

const CategoryFilter: React.FC = () => {
    return (
      <Card style={{ backgroundColor: '#F6F0F0', padding: '20px' }}>
        <Card.Body>
          <h3>Category</h3>
          {["TextBooks", "Furniture", "Electronics", "Cars", "Fitness"].map((category) => (
            <Form.Check key={category} type="checkbox" id={category.toLowerCase()} label={category} />
          ))}
          
        </Card.Body>
      </Card>
    );
  };
  

const Pagination: React.FC = () => {
  return (
    <div className="d-flex justify-content-center">
      <Button variant="outline-secondary">PREV</Button>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
        <Button key={num} variant="outline-secondary" className="mx-1">{num}</Button>
      ))}
      <Button variant="outline-secondary">NEXT</Button>
    </div>
  );
};

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
        setLoading(true); // Set loading to true at the start
        try {
            const token = Cookies.get('authToken');
            const response = await ItemService.getAllItems(0, null, token);
            setItems(response.data.data); // Access data directly from the response
        } catch (err) {
            if (axios.isAxiosError(err)) {
                // Handle Axios-specific errors
                setError(err.response?.data?.message || "Failed to fetch items");
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    fetchItems();
}, []);

  const handleLike = (id: number) => {
    setLikedItems((prevLiked) =>
      prevLiked.includes(id) ? prevLiked.filter((itemId) => itemId !== id) : [...prevLiked, id]
    );
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Form.Control
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <Row>
        <Col md={3}>
          <CategoryFilter />
        </Col>
        <Col md={9}>
          <Card style={{ backgroundColor: '#F6F0F0', padding: '20px' }}> {/* Card wrapper */}
            {loading ? (
              <Spinner animation="border" />
            ) : error ? (
              <Alert variant="danger">Error: {error}</Alert>
            ) : filteredItems.length > 0 ? (
              <Row>
                {filteredItems.map((item) => (
                  <Col md={4} key={item.id} className="mb-4">
                    <ItemCard item={item} onLike={handleLike} liked={likedItems.includes(item.id)} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Alert variant="warning">No items found</Alert>
            )}
          </Card>
        </Col>
      </Row>
      <Pagination />
    </Container>
  );
};

export default Home;
