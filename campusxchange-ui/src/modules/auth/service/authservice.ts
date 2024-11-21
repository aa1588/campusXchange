import axios from 'axios'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { DecodedToken } from '../model/DecodedToken'
import { BACKEND_BASE_URL } from '../../../config/config';

const API_URL = `${BACKEND_BASE_URL}/api/auth/`

class AuthService {
    register(
        firstname: string,
        lastname: string,
        email: string,
        phone: string,
        password: string
    ) {
        return axios.post(API_URL + 'register', {
            firstname,
            lastname,
            email,
            phone,
            password,
        })
    }

    verifyOtp(userid: string, otp: string) {
        return axios.post(API_URL + 'account/activate/' + userid, {
            otp,
        })
    }

    login(email: string, password: string) {
        return axios
            .post(API_URL + 'login', {
                email,
                password,
            })
            .then((response) => {
                const token = response.data.token
                console.log('Token:' + token)

                let decodedToken: DecodedToken | null = null
                try {
                    decodedToken = jwtDecode<DecodedToken>(token)
                } catch (error) {
                    console.error('Invalid token', error)
                }

                const currentLoggedInUser = {
                    issuer: decodedToken?.iss,
                    subject: decodedToken?.sub,
                    expiration: decodedToken?.exp,
                    issuedAt: decodedToken?.iat,
                    userId: decodedToken?.userId,
                    roles: decodedToken?.scope,
                }
                localStorage.setItem(
                    'user',
                    JSON.stringify(currentLoggedInUser)
                )
                Cookies.set('authToken', token, { expires: 7 })
            })
    }

    logout() {
        localStorage.removeItem('user')
        Cookies.remove('authToken')
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user')
        if (userStr) {
            return JSON.parse(userStr)
        }
        return null
    }
}

export default new AuthService()
