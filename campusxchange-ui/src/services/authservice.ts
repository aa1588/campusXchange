import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = 'http://localhost:8080/api/auth/'

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
                const dummyUser = {
                    id: 1,
                    firstname: 'Sudin',
                    lastname: 'Joshi',
                    email: 'sudinjoshi@my.unt.edu',
                    password: 'password123',
                    phone: '4694691271',
                }
                localStorage.setItem('user', JSON.stringify(dummyUser))
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
