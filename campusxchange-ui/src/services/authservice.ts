import axios from 'axios'

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
}

export default new AuthService()
