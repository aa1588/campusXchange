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

const CategoryFilter: React.FC<{ selectedCategories: string[]; onCategoryChange: (category: string) => void }> = ({ selectedCategories, onCategoryChange }) => {
  const categories = ["TEXTBOOKS", "FURNITURE", "ELECTRONICS", "CARS", "FITNESS"]; // Categories in uppercase

  return (
    <Card style={{ backgroundColor: '#F6F0F0', padding: '20px' }}>
      <Card.Body>
        <h3>Category</h3>
        {categories.map((category) => (
          <Form.Check
            key={category}
            type="checkbox"
            id={category.toLowerCase()}
            label={category}
            checked={selectedCategories.includes(category)}
            onChange={() => onCategoryChange(category)}
          />
        ))}
      </Card.Body>
    </Card>
  );
};

const Pagination: React.FC<{ currentPage: number; onPageChange: (newPage: number) => void }> = ({ currentPage, onPageChange }) => {
  return (
    <div className="d-flex justify-content-center">
      <Button 
        variant="outline-secondary" 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 0}
      >
        PREV
      </Button>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <Button 
          key={num} 
          variant="outline-secondary" 
          className="mx-1" 
          onClick={() => onPageChange(num)} 
          active={num === currentPage}
        >
          {num + 1}
        </Button>
      ))}
      <Button 
        variant="outline-secondary" 
        onClick={() => onPageChange(currentPage + 1)} 
      >
        NEXT
      </Button>
    </div>
  );
};

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // New state for selected categories

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true); // Set loading to true at the start
      try {
        const token = Cookies.get('authToken');
        const response = await ItemService.getAllItems(currentPage, selectedCategories, token); // Pass categories
        setItems(response.data.data); // Access data directly from the response
      } catch (err) {
        if (axios.isAxiosError(err)) {
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
  }, [currentPage, selectedCategories]); // Add selectedCategories to dependency array

  const handleLike = (id: number) => {
    setLikedItems((prevLiked) =>
      prevLiked.includes(id) ? prevLiked.filter((itemId) => itemId !== id) : [...prevLiked, id]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category) // Remove category if already selected
        : [...prevCategories, category] // Add category if not selected
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
          <CategoryFilter selectedCategories={selectedCategories} onCategoryChange={handleCategoryChange} />
        </Col>
        <Col md={9}>
          <Card style={{ backgroundColor: '#F6F0F0', padding: '20px' }}>
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
      <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
    </Container>
  );
};

export default Home;
