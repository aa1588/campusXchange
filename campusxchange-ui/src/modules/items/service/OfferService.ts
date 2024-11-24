import axios from 'axios'
import Cookies from 'js-cookie'
import {BACKEND_BASE_URL} from "../../../config/config";

const OFFER_CREATE_API_URL = `${BACKEND_BASE_URL}/api/offers/create`

class OfferService {

    makeAnOffer = async (itemId : number, amount : number) => {
        const token = Cookies.get('authToken');

        debugger;

        try{
            await axios.post(`${OFFER_CREATE_API_URL}/${itemId}`, {"amount" : amount}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            })
        }catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message || 'Error offering item'
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }

    }
}

export default new OfferService()