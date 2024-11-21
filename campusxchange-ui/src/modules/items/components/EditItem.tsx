import React, { useEffect, useState } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import CategoryService from '../service/CategoryService' // Assuming CategoryService is available
import ItemService from '../service/itemservice'
import { ToastUtil } from '../../../utils/ToastUtils'
import { CLOUDINARY_CONFIG } from '../../../config/cloudinaryConfig'

declare const window: Window &
    typeof globalThis & {
        cloudinary: {
            createUploadWidget: (
                p: {},
                p1: (error: any, result: any) => void
            ) => any
        }
    }

const EditItem: React.FC = () => {
    const { id } = useParams<{ id: string }>() // Get item ID from URL params
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [quantity, setQuantity] = useState<number | ''>('')
    const [price, setPrice] = useState<number | ''>('')
    const [category, setCategory] = useState('')
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [categories, setCategories] = useState<string[]>([])

    const widgetRef = React.useRef<any>()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories =
                    await CategoryService.fetchCategories()
                setCategories(fetchedCategories)
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }

        const fetchItem = async () => {
            try {
                const item = await ItemService.getItemById(Number(id)) // Use the service method
                setTitle(item.title)
                setDescription(item.description)
                setQuantity(item.quantity)
                setPrice(item.price)
                setCategory(item.category)
                setImageUrls(item.imageUrls)
            } catch (error) {
                console.error('Error fetching item:', error)
            }
        }

        fetchCategories()
        fetchItem()

        if (window.cloudinary) {
            widgetRef.current = window.cloudinary.createUploadWidget(
                {
                    cloudName: CLOUDINARY_CONFIG.cloudName,
                    uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
                },
                (
                    error: any,
                    result: { event: string; info: { secure_url: string } }
                ) => {
                    if (!error && result && result.event === 'success') {
                        setImageUrls((prevUrls) => [
                            ...prevUrls,
                            result.info.secure_url,
                        ])
                    }
                }
            )
        } else {
            console.error('Cloudinary is not loaded')
        }
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate inputs before submission
        if (
            !title ||
            !description ||
            !category ||
            quantity === '' ||
            price === '' ||
            imageUrls.length === 0
        ) {
            alert('Please fill in all the fields and upload an image.')
            return
        }

        // Prepare form data
        const formData = {
            title,
            description,
            quantity,
            price: parseFloat(price.toString()).toFixed(2),
            category,
            imageUrls,
        }

        try {
            const updatedItem = await ItemService.updateItem(id, formData)
            console.log('Item updated successfully:', updatedItem)
            alert('Item updated successfully!')

            navigate('/home')
        } catch (error) {
            console.error('Error updating item:', error)
            ToastUtil.displayErrorToast('Error updating item')
        }
    }

    return (
        <div>
            <h2>Edit Item</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter item title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="quantity">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter quantity"
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(Number(e.target.value))
                                }
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) =>
                                    setPrice(Number(e.target.value))
                                }
                                required
                                step="0.01"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <Form.Group controlId="imageUpload">
                            <Form.Label>Upload Image Files</Form.Label>
                            <Button
                                className="mx-2 text-white"
                                variant="info"
                                onClick={() => widgetRef.current.open()}
                            >
                                Upload Images
                            </Button>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Display uploaded images */}
                <Row>
                    {imageUrls.map((url, index) => (
                        <Col key={index} md={4}>
                            <img
                                src={url}
                                alt={`Uploaded ${index}`}
                                style={{ width: '100%' }}
                            />
                        </Col>
                    ))}
                </Row>

                <Button
                    className={'my-4'}
                    variant="secondary"
                    type="button"
                    onClick={() => window.history.back()}
                >
                    Cancel
                </Button>
                <Button className={'ms-2'} variant="success" type="submit">
                    Update
                </Button>
            </Form>
        </div>
    )
}

export default EditItem
