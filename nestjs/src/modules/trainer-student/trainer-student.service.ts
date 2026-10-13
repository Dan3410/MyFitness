import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import type { TrainerStudentRelationship, UserSearchResult } from 'src/models/user';

@Injectable()
export class TrainerStudentService {
  private readonly trainerStudentApiUrl = 'http://localhost:8080/trainer/students';

  constructor(private readonly httpService: HttpService) {}

  async getStudents(authorization: string): Promise<UserSearchResult[]> {
    const response = await firstValueFrom(
      this.httpService.get<UserSearchResult[]>(this.trainerStudentApiUrl, { headers: { authorization } }),
    );
    return response.data;
  }

  async getTrainers(authorization: string): Promise<UserSearchResult[]> {
    const response = await firstValueFrom(
      this.httpService.get<UserSearchResult[]>(`${this.trainerStudentApiUrl}/trainers`, {
        headers: { authorization },
      }),
    );
    return response.data;
  }

  async getRelationshipsForProfile(
    userId: string,
    authorization: string,
  ): Promise<TrainerStudentRelationship[]> {
    const response = await firstValueFrom(
      this.httpService.get<TrainerStudentRelationship[]>(
        `${this.trainerStudentApiUrl}/profile/${encodeURIComponent(userId)}`,
        { headers: { authorization } },
      ),
    );
    return response.data;
  }

  async linkStudent(studentId: string, authorization: string): Promise<UserSearchResult> {
    const response = await firstValueFrom(
      this.httpService.post<UserSearchResult>(
        `${this.trainerStudentApiUrl}/${encodeURIComponent(studentId)}`,
        {},
        { headers: { authorization } },
      ),
    );
    return response.data;
  }

  async unlinkStudent(studentId: string, authorization: string): Promise<UserSearchResult[]> {
    const response = await firstValueFrom(
      this.httpService.delete<UserSearchResult[]>(
        `${this.trainerStudentApiUrl}/${encodeURIComponent(studentId)}`,
        { headers: { authorization } },
      ),
    );
    return response.data;
  }

  async unlinkTrainer(trainerId: string, authorization: string): Promise<UserSearchResult[]> {
    const response = await firstValueFrom(
      this.httpService.delete<UserSearchResult[]>(
        `${this.trainerStudentApiUrl}/trainers/${encodeURIComponent(trainerId)}`,
        { headers: { authorization } },
      ),
    );
    return response.data;
  }
}