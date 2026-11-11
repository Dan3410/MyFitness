import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import type { StudentGroup, StudentGroupActivity, StudentGroupRequest } from 'src/models/studentGroup';
import type { UserSearchResult } from 'src/models/user';

@Injectable()
export class StudentGroupsService {
  private readonly studentGroupsApiUrl = 'http://localhost:8080/groups';

  constructor(private readonly httpService: HttpService) {}

  async getGroups(authorization: string): Promise<StudentGroup[]> {
    const response = await firstValueFrom(
      this.httpService.get<StudentGroup[]>(this.studentGroupsApiUrl, { headers: { authorization } }),
    );
    return response.data;
  }

  async createGroup(request: StudentGroupRequest, authorization: string): Promise<StudentGroup> {
    const response = await firstValueFrom(
      this.httpService.post<StudentGroup>(this.studentGroupsApiUrl, request, { headers: { authorization } }),
    );
    return response.data;
  }

  async getGroup(groupId: string, authorization: string): Promise<StudentGroup> {
    const response = await firstValueFrom(
      this.httpService.get<StudentGroup>(`${this.studentGroupsApiUrl}/${encodeURIComponent(groupId)}`, {
        headers: { authorization },
      }),
    );
    return response.data;
  }

  async getMembers(groupId: string, authorization: string): Promise<UserSearchResult[]> {
    const response = await firstValueFrom(
      this.httpService.get<UserSearchResult[]>(
        `${this.studentGroupsApiUrl}/${encodeURIComponent(groupId)}/members`,
        { headers: { authorization } },
      ),
    );
    return response.data;
  }

  async getActivities(groupId: string, authorization: string): Promise<StudentGroupActivity[]> {
    const response = await firstValueFrom(
      this.httpService.get<StudentGroupActivity[]>(
        `${this.studentGroupsApiUrl}/${encodeURIComponent(groupId)}/activities`,
        { headers: { authorization } },
      ),
    );
    return response.data;
  }

  async updateGroup(
    groupId: string,
    request: StudentGroupRequest,
    authorization: string,
  ): Promise<StudentGroup> {
    const response = await firstValueFrom(
      this.httpService.put<StudentGroup>(
        `${this.studentGroupsApiUrl}/${encodeURIComponent(groupId)}`,
        request,
        { headers: { authorization } },
      ),
    );
    return response.data;
  }
}
