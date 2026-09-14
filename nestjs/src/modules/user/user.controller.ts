import { Body, Controller, Get, Headers, Param, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import type { User, UserSearchResult } from 'src/models/user';
import type { WeightHistoryPoint } from 'src/models/weightHistory';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('users/search')
  searchUsers(@Headers('authorization') authorization: string, @Query('name') name: string): Promise<UserSearchResult[]> {
    return this.userService.searchUsers(name, authorization);
  }

  @Get('userById/:id')
  getUserById(@Headers('authorization') authorization: string, @Param('id') id: string): Promise<User> {
    console.log("userById")
    return this.userService.getUserById(id, authorization);
  }

  @Get('weight-history/:id')
  getWeightHistoryById(@Headers('authorization') authorization: string, @Param('id') id: string): Promise<WeightHistoryPoint[]> {
    return this.userService.getWeightHistoryById(id, authorization);
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
