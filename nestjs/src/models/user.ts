export interface User {
  id: string,
  username: string,
  email: string,
  name: string
  lastName: string
  weight: number
  weightUnit: string
  height: number
  heightUnit: string
  birthDay: string
  gender: string
  physicalActivityLvl: string
  objective: string
  profileImage?: string
}

export interface UserSearchResult {
  name: string,
  profileImage?: string
}