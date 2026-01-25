import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import type { User } from 'src/models/user';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/user/:id')
  async getUser(@Param('id') id: string): Promise<User> {
    let response = await this.userService.getUser(id);
    return response
  }

  @Put('/user/:id')
  editUser(
    @Param('id') id: string,
    @Body() userData: User): User {
    return this.userService.editUser(id, userData);
  }
}
