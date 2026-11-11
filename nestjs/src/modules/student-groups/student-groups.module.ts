import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StudentGroupsController } from './student-groups.controller';
import { StudentGroupsService } from './student-groups.service';

@Module({
  imports: [HttpModule],
  controllers: [StudentGroupsController],
  providers: [StudentGroupsService],
})
export class StudentGroupsModule {}
