import { Body, Controller, Get, Headers, Param, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import type { User, UserSearchResult } from 'src/models/user';
import type { WeightHistoryPoint } from 'src/models/weightHistory';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('users')
  searchUsers(@Headers('authorization') authorization: string, @Query('name') name = ''): Promise<UserSearchResult[]> {
    return this.userService.searchUsers(name, authorization);
  }

  @Get(':id')
  async getUser(@Param('id') id: string, @Headers('authorization') authorization: string): Promise<User> {
    let response = await this.userService.getUser(id, authorization);
    return response
  }

  @Get(':id/weight-history')
  getWeightHistory(@Headers('authorization') authorization: string): Promise<WeightHistoryPoint[]> {
    return this.userService.getWeightHistory(authorization);
  }

  @Put(':id')
  editUser(
    @Param('id') id: string,
    @Body() userData: User,
    @Headers('authorization') authorization: string): Promise<User> {
    return this.userService.editUser(id, userData, authorization);
  }
}
