import { User, UserSearchResult } from "../models/user";
import { GET_DATA_ERROR_MESSAGE } from "../const/errorMessages";
import { SESSION_STORAGE_KEY } from './authService';
import { WeightHistoryPoint } from '../models/weightHistory';

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

    async searchUsers(name: string): Promise<UserSearchResult[]> {
        const response = await fetch(`${API_URL}users/search?name=${encodeURIComponent(name)}`, { headers: authHeaders() })
        if (!response.ok) throw new Error(GET_DATA_ERROR_MESSAGE)
        return response.json() as Promise<UserSearchResult[]>
    }

    async getUserById(id: string): Promise<User> {
        const response = await fetch(`${API_URL}userById/${encodeURIComponent(id)}`, { headers: authHeaders() })
        if (!response.ok) throw new Error(GET_DATA_ERROR_MESSAGE)
        return response.json() as Promise<User>
    }

    async editUserData(userData: User) {
        const userId = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '{}').userId || ''
        const response = await fetch(API_URL + userId, {
            method: 'PUT',
            body: JSON.stringify(userData),
            headers: authHeaders()
        })
        if (!response.ok) throw new Error(GET_DATA_ERROR_MESSAGE)
        return response.json() as Promise<User>
    }

    async getWeightHistory(): Promise<WeightHistoryPoint[]> {
        const userId = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '{}').userId || ''
        const response = await fetch(`${API_URL}${userId}/weight-history`, { headers: authHeaders() })
        if (!response.ok) throw new Error(GET_DATA_ERROR_MESSAGE)
        return response.json() as Promise<WeightHistoryPoint[]>
    }

    async getWeightHistoryById(id: string): Promise<WeightHistoryPoint[]> {
        const userId = id
        const response = await fetch(`${API_URL}weight-history/${userId}`, { headers: authHeaders() })
        if (!response.ok) throw new Error(GET_DATA_ERROR_MESSAGE)
        return response.json() as Promise<WeightHistoryPoint[]>
    }

}

export const profileService = new ProfileService()
