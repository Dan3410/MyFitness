import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import RestStep from './restStep';
import { StepType } from '../../../../../models/workoutSteps';
import { WorkoutCategory } from '../../../../../models/workoutCategories';

it('renders the rest step component', () => {
  render(<RestStep step={{ type: StepType.REST, seconds: 30 }} workoutCategory={WorkoutCategory.GYM} />)

  expect(screen.getAllByText('Descanso').length).toBeGreaterThan(0)
  expect(screen.getByText('0:30')).toBeTruthy()
});
