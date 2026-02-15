const API_URL = 'http://localhost:3000/workout/'

class WorkoutService {
    constructor() { }

    async getCategories() {
        return fetch(API_URL + "categories").then((response: Response) => {
            return response.json()
        }).catch((err: Error) => err)
    }

    async getWorkoutsListItem(id: string, category: string) {
        return fetch(API_URL + "list/" + id + `?category=${category}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then((response: Response) => { return response.json() }).catch((err: Error) => err);
    }

    async deleteWorkout(id: string) {
        return fetch(API_URL + id, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        }).then((response: Response) => { return response.json() }).catch((err: Error) => err);
    }
}

export const workoutService = new WorkoutService()
