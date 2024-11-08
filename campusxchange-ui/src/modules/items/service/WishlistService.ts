import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = 'http://localhost:8080/api/wishlists'

class WishlistService {
    addToWishList = async (itemId: number) => {
        const token = Cookies.get('authToken')

        try {
            await axios.post(
                `${API_URL}/add/${itemId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message ||
                        'Error adding item to wishlist'
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }
    }

    getMyWishListItems = async () => {
        const token = Cookies.get('authToken')

        try {
            return await axios.get(`${API_URL}/items/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message ||
                        'Error getting items from wishlist'
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }
    }

    deleteFromMyWishlistItems = async (itemId: number) => {
        const token = Cookies.get('authToken')

        try {
            await axios.delete(`${API_URL}/item/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message ||
                        'Error deleting item from wishlist'
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }
    }
}

export default new WishlistService()
