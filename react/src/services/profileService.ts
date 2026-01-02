import { User } from "../models/user";

const API_URL = 'http://localhost:3000/user/'

class ProfileService {
    constructor() { }

    async getUserData(id: string) {
        //It does nothing with the id for now
        return fetch(API_URL + id).then((response: Response) => {
            return response.json()
        }).catch((err: Error) => err)
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
