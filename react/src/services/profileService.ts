import { User } from "../models/user";
import { GET_DATA_ERROR_MESSAGE } from "../const/errorMessages";
import { SESSION_STORAGE_KEY } from './authService';

const API_URL = 'http://localhost:3000/user/'

const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '{}').token || ''}`
})

class ProfileService {
    constructor() { }

    async getUserData() {
        const userId = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '{}').userId || ''
        return fetch(API_URL + userId, { headers: authHeaders() }).then(async (response: Response) => {
            if (!response.ok) {
                throw new Error(GET_DATA_ERROR_MESSAGE);
            }

            return response.json()
        })
    }

    async editUserData(userData: User) {
        const userId = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '{}').userId || ''
        return fetch(API_URL + userId, {
            method: 'PUT',
            body: JSON.stringify(userData),
            headers: authHeaders()
        }).then((response: Response) => { return response.json() }).catch((err: Error) => err);
    }
}

export const profileService = new ProfileService()
