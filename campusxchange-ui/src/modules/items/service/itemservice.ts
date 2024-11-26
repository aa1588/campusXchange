import axios from 'axios'
import Cookies from 'js-cookie'
import { BACKEND_BASE_URL } from '../../../config/config'

const API_URL = `${BACKEND_BASE_URL}/api/items`

class ItemService {
    getAllItems(
        page: number | null = null,
        categories: string[] | null = null,
        token: string | null = null
    ) {
        // Construct the query parameters
        const params = new URLSearchParams()

        if (page !== null) {
            params.append('page', page.toString())
        }

        if (categories && Array.isArray(categories)) {
            categories.forEach((category) => {
                params.append('categories', category)
            })
        }

        // Set up headers
        const headers: { [key: string]: string } = {} // Define headers as a record of key-value pairs
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        // Make the GET request with the constructed query parameters and headers
        return axios.get(`${API_URL}?${params.toString()}`, { headers })
    }

    fetchItemsByUser = async (token: string | undefined) => {
        try {
            const response = await axios.get(`${API_URL}/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            return response.data // Axios returns the data inside `response.data`
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message || 'Error fetching items'
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }
    }

    getItemById = async (id: number | undefined) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`)
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message ||
                        'Error fetching item by its id ' + id?.toString()
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }
    }

    addItemForSale = async (formData: any) => {
        const token = Cookies.get('authToken')

        try {
            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message ||
                        'Error editing item by its id'
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }
    }

    async updateItem(id: string | undefined, itemData: any) {
        const token = Cookies.get('authToken')

        try {
            const response = await axios.put(`${API_URL}/${id}`, itemData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message ||
                        'Error editing item by its id ' + id?.toString()
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }
    }

    deleteItem = async (itemId: number, token: string | undefined) => {
        if (!token) {
            throw new Error('No authentication token found')
        }

        try {
            await axios.delete(`${API_URL}/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message || 'Error deleting item'
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }
    }
}

export default new ItemService()
