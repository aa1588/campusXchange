import axios from 'axios';

const API_URL = 'http://localhost:8080/api/items';

class ItemService {
    getAllItems(page: number | null = null, categories: string[] | null = null, token: string | null = null) {
        // Construct the query parameters
        const params = new URLSearchParams();

        if (page !== null) {
            params.append('page', page.toString());
        }

        if (categories && Array.isArray(categories)) {
            categories.forEach(category => {
                params.append('categories', category);
            });
        }

        // Set up headers
        const headers: { [key: string]: string } = {}; // Define headers as a record of key-value pairs
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Make the GET request with the constructed query parameters and headers
        return axios.get(`${API_URL}?${params.toString()}`, { headers });
    }
}

export default new ItemService();
