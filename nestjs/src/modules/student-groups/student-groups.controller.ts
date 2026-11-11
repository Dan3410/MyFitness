import { Body, Controller, Get, Headers, Param, Post, Put } from '@nestjs/common';
import type { StudentGroup, StudentGroupActivity, StudentGroupRequest } from 'src/models/studentGroup';
import type { UserSearchResult } from 'src/models/user';
import { StudentGroupsService } from './student-groups.service';

@Controller('groups')
export class StudentGroupsController {
  constructor(private readonly studentGroupsService: StudentGroupsService) {}

  @Get()
  getGroups(@Headers('authorization') authorization: string): Promise<StudentGroup[]> {
    return this.studentGroupsService.getGroups(authorization);
  }

  @Post()
  createGroup(
    @Body() request: StudentGroupRequest,
    @Headers('authorization') authorization: string,
  ): Promise<StudentGroup> {
    return this.studentGroupsService.createGroup(request, authorization);
  }

  @Get(':groupId')
  getGroup(
    @Param('groupId') groupId: string,
    @Headers('authorization') authorization: string,
  ): Promise<StudentGroup> {
    return this.studentGroupsService.getGroup(groupId, authorization);
  }

  @Get(':groupId/members')
  getMembers(
    @Param('groupId') groupId: string,
    @Headers('authorization') authorization: string,
  ): Promise<UserSearchResult[]> {
    return this.studentGroupsService.getMembers(groupId, authorization);
  }

  @Get(':groupId/activities')
  getActivities(
    @Param('groupId') groupId: string,
    @Headers('authorization') authorization: string,
  ): Promise<StudentGroupActivity[]> {
    return this.studentGroupsService.getActivities(groupId, authorization);
  }

  @Put(':groupId')
  updateGroup(
    @Param('groupId') groupId: string,
    @Body() request: StudentGroupRequest,
    @Headers('authorization') authorization: string,
  ): Promise<StudentGroup> {
    return this.studentGroupsService.updateGroup(groupId, request, authorization);
  }
}
