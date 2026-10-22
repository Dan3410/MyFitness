import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import SetStep from './setStep';
import { WorkoutCategory } from '../../../../../models/workoutCategories';
import { StepType } from '../../../../../models/workoutSteps';

it('renders the set step component', () => {
  render(
    <SetStep
      step={{ type: StepType.SET, repeat: 3, steps: [{ type: StepType.REST, seconds: 30 }] }}
      workoutCategory={WorkoutCategory.GYM}
    />,
  );

  expect(screen.getByText('Repetir 3x')).toBeTruthy()
  expect(screen.getByText('0:30')).toBeTruthy()
});
