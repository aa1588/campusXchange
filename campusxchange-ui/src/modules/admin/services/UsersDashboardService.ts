import axios from 'axios'
import { BACKEND_BASE_URL } from '../../../config/config'

const API_URL = `${BACKEND_BASE_URL}/api/admin/users`

export const fetchUsers = async (token: string) => {
    const response = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return response.data
}

export const changeUserStatus = async (
    userId: number,
    status: string,
    token: string
) => {
    const response = await axios.put(
        `${BACKEND_BASE_URL}/api/admin/change-status/${userId}?status=${status}`,
        null,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
    return response.status
}
