import axios from 'axios'

const API_URL = 'http://localhost:8080/api/categories'

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
