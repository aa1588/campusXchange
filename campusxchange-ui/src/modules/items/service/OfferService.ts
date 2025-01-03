import axios from 'axios'
import Cookies from 'js-cookie'
import { BACKEND_BASE_URL } from '../../../config/config'

const OFFER_CREATE_API_URL = `${BACKEND_BASE_URL}/api/offers/create`
const OFFER_ALL_MY_ITEMS_API_URL = `${BACKEND_BASE_URL}/api/offers/allitemsoffer`
const API_OFFER = `${BACKEND_BASE_URL}/api/offers`

class OfferService {
    makeAnOffer = async (itemId: number, formdata: string) => {
        const token = Cookies.get('authToken')

        try {
            return await axios.post(`${OFFER_CREATE_API_URL}/${itemId}`, formdata, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message || 'Error offering item'
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }
    }

    getAllMyListingsOffer = async () => {
        const token = Cookies.get('authToken')

        try {
            const response = await axios.get(`${OFFER_ALL_MY_ITEMS_API_URL}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message || 'Error getting offers'
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }
    }

    acceptOffer = async (offerid: number) => {
        const token = Cookies.get('authToken')

        try {
            const response = await axios.put(
                `${API_OFFER}/${offerid}/accept`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message || 'Error accepting offers'
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }
    }

    declineOffer = async (offerid: number) => {
        const token = Cookies.get('authToken')

        try {
            const response = await axios.put(
                `${API_OFFER}/${offerid}/decline`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message || 'Error accepting offers'
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }
    }

    getOfferForItem = async (itemid : number) => {
        const token = Cookies.get('authToken');

        try{
            const response  = await axios.get(`${API_OFFER}/item/${itemid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            })
            return response.data
        }catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message || 'Error getting offers'
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }
    }

    updateOffer = async (offerid : number, formdata : string) => {
        const token = Cookies.get('authToken');

        try{
            const response  = await axios.put(`${API_OFFER}/${offerid}/update`, formdata, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            })
            return response;
        }catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message || 'Error updating offers'
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }
    }
}

export default new OfferService()
