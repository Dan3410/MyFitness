import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import StepEditor from './stepEditor';
import { WorkoutCategory } from '../../../../models/workoutCategories';
import { RestStep, StepType } from '../../../../models/workoutSteps';

it('renders the selected step details', () => {
  const step: RestStep = { type: StepType.REST, seconds: 45 };
  render(<StepEditor step={step} workoutCategory={WorkoutCategory.GYM} onChange={() => {}} onDelete={() => {}} />)

  expect(screen.getByText('Segundos')).toBeTruthy()
  expect(screen.getByRole('button', { name: /eliminar/i })).toBeTruthy()
});