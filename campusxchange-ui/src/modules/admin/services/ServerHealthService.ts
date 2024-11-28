import axios from 'axios'
import { BACKEND_BASE_URL } from '../../../config/config'

const SERVER_HEALTH_URL = `${BACKEND_BASE_URL}/actuator/health`

export const getServerHealth = async (token: string | undefined) => {
    try {
        const response = await axios.get(SERVER_HEALTH_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        throw new Error('Failed to fetch server health')
    }
}
