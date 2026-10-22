import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import RunStep from './runStep';
import { StepType } from '../../../../../models/workoutSteps';

it('renders the run step component', () => {
  render(<RunStep step={{ type: StepType.RUNTIME, distance: 0, calories: 0, time: 600, speed: 10 }} />)

  expect(screen.getByText('Correr')).toBeTruthy()
  expect(screen.getByText('10 Km/h')).toBeTruthy()
});
