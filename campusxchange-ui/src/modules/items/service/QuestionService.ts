import axios from 'axios'
import Cookies from 'js-cookie'
import {BACKEND_BASE_URL} from "../../../config/config";

const API_URL = `${BACKEND_BASE_URL}/api/questions/item`
const API_URL_ANSWER = `${BACKEND_BASE_URL}/api/answers`
const API_URL_QUESTION_ANSWER = `${BACKEND_BASE_URL}/api/questions-answers`

class QuestionService{

    postQuestion = async (itemId : number, question : string) => {
        const token = Cookies.get('authToken');

        try{
            await axios.post(`${API_URL}/${itemId}`, {"question" : question}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            })
        }catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message || 'Error posting question'
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }

    }
    
    getAllQuestionsByItemId = async (itemId : number) => {
        const token = Cookies.get('authToken');

        try{
            return await axios.get(`${API_URL}/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            })
        }catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message || 'Error getting all questions'
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }
    }

    postAnswerForAQuestion = async (questionId : number, answer : string) => {
        const token = Cookies.get('authToken');

        try{
            return await axios.post(`${API_URL_ANSWER}/${questionId}`, {"answer" : answer}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            })
        }catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message || 'Error getting all questions'
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }
    }

    getAllQuestionAnswerByItemId = async(itemId : number) => {
        const token = Cookies.get('authToken');

        try{
            return await axios.get(`${API_URL_QUESTION_ANSWER}/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            })
        }catch(error){
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.message || 'Error getting all questions and answers'
                )
            } else {
                throw new Error('An unknown error occurred')
            }
        }
    }
}

export default new QuestionService()