import { render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import WorkoutCategories from './workoutCategories';
import { WorkoutCategory } from '../../../../models/workoutCategories'
import { workoutService } from '../../../../services/workoutService'

it('loads available workout categories', async () => {
  vi.spyOn(workoutService, 'getCategories').mockResolvedValue([
    { label: 'Todos', value: WorkoutCategory.ALL },
    { label: 'Gimnasio', value: WorkoutCategory.GYM },
    { label: 'Natación', value: WorkoutCategory.SWIM },
  ])
  render(
    <MemoryRouter>
      <WorkoutCategories />
    </MemoryRouter>,
  )

  expect(await screen.findByRole('button', { name: /Gimnasio/ })).toBeTruthy()
  expect(screen.getByRole('button', { name: /Natación/ })).toBeTruthy()
});