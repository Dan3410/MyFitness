import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import SwimStep from './swimStep';
import { StepType } from '../../../../../models/workoutSteps';
import { SwimStroke } from '../../../../../models/workoutSteps';

it('renders the swim step component', () => {
  render(<SwimStep step={{ type: StepType.SWIMTIME, distance: 0, time: 50, gear: [], stroke: SwimStroke.CHOICE }} />)

  expect(screen.getByText('A elección')).toBeTruthy()
  expect(screen.getByText('0:50')).toBeTruthy()
});
