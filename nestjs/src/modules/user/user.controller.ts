import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import type { User } from 'src/models/user';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    let response = await this.userService.getUser(id);
    return response
  }

  @Put(':id')
  editUser(
    @Param('id') id: string,
    @Body() userData: User): Promise<User> {
    return this.userService.editUser(id, userData);
  }
}
