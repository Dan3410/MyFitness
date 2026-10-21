export type TrainerRequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED'
export type NotificationType = 'TRAINER_REQUEST' | 'TRAINER_REQUEST_RESPONSE' | 'WORKOUT_SHARED' | 'WORKOUT_UNSHARED' | 'TRAINER_STUDENT_UNLINKED' | 'EVENT_CREATED' | 'EVENT_CANCELLED'

export interface TrainerRequestNotification {
  id: string
  trainerId: string
  trainerName: string
  recipientId: string
  message: string
  createdAt: string
  seen: boolean
  status: TrainerRequestStatus | null
  type: NotificationType
}