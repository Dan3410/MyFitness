import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import GymStep from './gymStep';
import { StepType } from '../../../../../models/workoutSteps';

it('renders the gym step component', () => {
  render(
    <GymStep step={{ type: StepType.EXERCISE, exercise: 'Bench Press', byTime: false, reps: 8, time: 0, weight: 70 }} />,
  );

  expect(screen.getByText('Bench Press')).toBeTruthy()
  expect(screen.getByText('8 repeticiones - 70 kg')).toBeTruthy()
});
