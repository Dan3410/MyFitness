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
  isProfilePrivate: boolean
  isTrainer: boolean
}

export interface UserSearchResult {
  id: string,
  name: string,
  profileImage?: string
  isTrainer: boolean
}

export interface TrainerStudentRelationship extends UserSearchResult {
  relationshipType: 'TRAINER' | 'STUDENT'
}