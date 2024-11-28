import axios from 'axios'
import { BACKEND_BASE_URL } from '../../../config/config'

const API_URL = `${BACKEND_BASE_URL}/api/admin/dashboard-stats`

export const fetchDashboardStats = async (token: string | undefined) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        throw error
    }
}
