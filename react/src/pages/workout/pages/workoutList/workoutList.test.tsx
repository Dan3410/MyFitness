import { render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { AuthProvider } from '../../../../context/AuthContext'
import { MemoryRouter } from 'react-router-dom';
import WorkoutList from './workoutList';
import { workoutService } from '../../../../services/workoutService'
import { profileService } from '../../../../services/profileService'
import { trainerStudentService } from '../../../../services/trainerStudentService'
import { WorkoutCategory } from '../../../../models/workoutCategories'
import { userFixture } from '../../../../test/userFixture'

it('renders the create workout action and loads the workout list', async () => {
  vi.spyOn(workoutService, 'getWorkoutsListItem').mockResolvedValue([])
  vi.spyOn(workoutService, 'getCategories').mockResolvedValue([
    { label: 'Todos', value: WorkoutCategory.ALL },
    { label: 'Gimnasio', value: WorkoutCategory.GYM },
  ])
  vi.spyOn(profileService, 'getUserData').mockResolvedValue(userFixture)
  vi.spyOn(trainerStudentService, 'getStudents').mockResolvedValue([])
  render(
    <AuthProvider>
      <MemoryRouter>
        <WorkoutList />
      </MemoryRouter>
    </AuthProvider>,
  );

  expect(screen.getByRole('button', { name: 'Crear rutina' })).toBeTruthy()
  expect(await screen.findByRole('table')).toBeTruthy()
});