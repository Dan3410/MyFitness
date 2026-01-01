const API_URL = 'http://localhost:3000/user/'

export const getUserData = (id: string) => {
    //It does nothing with the id for now
    return fetch(API_URL+id).then((response: Response) => {
        return response.json()
    }).catch((err: Error) => err)
}