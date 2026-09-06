import { WorkoutCategory } from '../models/workoutCategories';
import { GET_DATA_ERROR_MESSAGE, SAVE_WORKOUT_ERROR_MESSAGE } from '../const/errorMessages';
import { SESSION_STORAGE_KEY } from './authService';

const API_URL = 'http://localhost:3000/workout/'

const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '{}').token || ''}`
})

class WorkoutService {
    constructor() { }

    async getCategories() {
        return fetch(API_URL + "categories", { headers: authHeaders() }).then((response: Response) => response.json()).catch((err: Error) => err)
    }

    async getWorkoutsListItem(id: string, category: WorkoutCategory) {

        return fetch(API_URL + "list/" + id + `?category=${category}`, { method: 'GET', headers: authHeaders() }).then(async (response: Response) => {
            if (!response.ok) throw new Error(await response.text() || GET_DATA_ERROR_MESSAGE);
            return response.json();
        });
    }

        async createWorkout(id: string, workout: any) {

        return fetch(API_URL + id, { method: 'POST', headers: authHeaders(), body: JSON.stringify(workout) }).then(async (response: Response) => {
            if (!response.ok) throw new Error(await response.text() || SAVE_WORKOUT_ERROR_MESSAGE);
            return response.json();
        });
    }

    async editWorkout(id: string, workout: any) {

        return fetch(API_URL + id, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(workout) }).then(async (response: Response) => {
            if (!response.ok) throw new Error(await response.text() || SAVE_WORKOUT_ERROR_MESSAGE);
            return response.json();
        });
        }

    async getWorkoutSteps(id: string) {

        return fetch(API_URL + id, { method: 'GET', headers: authHeaders() }).then(async (response: Response) => {
            if (!response.ok) throw new Error(await response.text() || GET_DATA_ERROR_MESSAGE);
            return response.json();
        });
    }

    async deleteWorkout(id: string) {
        return fetch(API_URL + id, { method: 'DELETE', headers: authHeaders() }).then((response: Response) => response.json()).catch((err: Error) => err);
    }

}

export const workoutService = new WorkoutService()
