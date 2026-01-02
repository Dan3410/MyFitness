import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import type { User } from 'src/models/user';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/user/:id')
  getUser(@Param('id') id: string): User {
    return this.userService.getUser(id);
  }

  @Put('/user/:id')
  editUser(
    @Param('id') id: string,
    @Body() userData: User): User {
    return this.userService.editUser(id, userData);
  }
}
