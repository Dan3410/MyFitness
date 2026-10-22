import { render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { workoutService } from '../../../../services/workoutService'
import { WorkoutCategory } from '../../../../models/workoutCategories'
import WorkoutView from './workoutView'

it('loads and displays a workout and its steps', async () => {
  vi.spyOn(workoutService, 'getWorkoutSteps').mockResolvedValue({
    id: 'workout-1',
    name: 'Morning workout',
    category: WorkoutCategory.GYM,
    steps: [{ type: 'REST', seconds: 30 }],
  })

  render(
    <MemoryRouter initialEntries={['/workout/view/workout-1']}>
      <Routes>
        <Route path="/workout/view/:id" element={<WorkoutView />} />
      </Routes>
    </MemoryRouter>,
  )

  expect(await screen.findByRole('heading', { name: 'Morning workout' })).toBeTruthy()
  expect(screen.getByText('0:30')).toBeTruthy()
})
