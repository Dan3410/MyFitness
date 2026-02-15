import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { WorkoutListItem } from 'src/models/workout';
import { WorkoutCategories } from 'src/models/workoutCategories';

@Injectable()
export class WorkoutService {

  private workoutApiUrl = "http://localhost:8080/workout";
  constructor(private readonly httpService: HttpService){}

  async getCategories(): Promise<WorkoutCategories[]> {
    const response = await firstValueFrom(this.httpService.get(this.workoutApiUrl + "/categories"));
    return response.data;
  }
  
  async getWorkouts(id: string, category: string): Promise<WorkoutListItem[]> {
    const response = (await firstValueFrom(this.httpService.get(this.workoutApiUrl + "/list/" + id + `?category=${category}`)));
    return response.data
  }

  async deleteWorkout(id: string): Promise<WorkoutListItem[]>{
    const response = (await firstValueFrom(this.httpService.delete(this.workoutApiUrl + `/${id}`)));
    return response.data
  }
}
