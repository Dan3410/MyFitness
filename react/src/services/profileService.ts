import { User } from "../models/user";
import { GET_DATA_ERROR_MESSAGE } from "../const/errorMessages";

const API_URL = 'http://localhost:3000/user/'

class ProfileService {
    constructor() { }

    async getUserData(id: string) {
        //It does nothing with the id for now
        return fetch(API_URL + id).then(async (response: Response) => {
            if (!response.ok) {
                throw new Error(GET_DATA_ERROR_MESSAGE);
            }

            return response.json()
        })
    }

    async editUserData(id: string, userData: User) {
        return fetch(API_URL + id, {
            method: 'PUT',
            body: JSON.stringify(userData),
            headers: { 'Content-Type': 'application/json' }
        }).then((response: Response) => { return response.json() }).catch((err: Error) => err);
    }
}

export const profileService = new ProfileService()
