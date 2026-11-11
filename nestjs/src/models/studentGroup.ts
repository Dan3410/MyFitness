import type { UserSearchResult } from './user';

export interface StudentGroup {
  id: string;
  name: string;
  trainerId: string;
  trainerName: string;
  administrator: boolean;
  members: UserSearchResult[];
}

export interface StudentGroupActivity {
  id: string;
  type: 'MEMBER_ADDED' | 'MEMBER_REMOVED' | 'WORKOUT_SHARED' | 'EVENT_CREATED';
  message: string;
  createdAt: string;
}

export interface StudentGroupRequest {
  name: string;
  memberIds?: string[];
}
