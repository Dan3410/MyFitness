import { Body, Controller, Get, Headers, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import type { User } from 'src/models/user';
import type { WeightHistoryPoint } from 'src/models/weightHistory';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) { }

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
