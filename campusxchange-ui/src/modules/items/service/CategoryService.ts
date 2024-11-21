import axios from 'axios'
import { BACKEND_BASE_URL } from '../../../config/config';

const API_URL = `${BACKEND_BASE_URL}/api/categories`

const CategoryService = {
    fetchCategories: async (): Promise<string[]> => {
        try {
            const response = await axios.get(API_URL)
            return response.data
        } catch (error) {
            console.error('Error fetching categories:', error)
            throw error
        }
    },
}

export default CategoryService
