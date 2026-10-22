import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import StepsList from './stepsList';
import { WorkoutCategory } from '../../../../models/workoutCategories'
import { StepType } from '../../../../models/workoutSteps'

it('renders workout steps and reports the selected step', () => {
  const onSelectStep = vi.fn()
  render(
    <StepsList
      workout={{ id: 'workout-1', name: 'Full body', category: WorkoutCategory.GYM, steps: [{ type: StepType.REST, seconds: 30 }] }}
      selectedStepIndex={0}
      onSelectStep={onSelectStep}
    />,
  )

  expect(screen.getByText('Pasos del entrenamiento')).toBeTruthy()
  fireEvent.click(screen.getByText('0:30'))
  expect(onSelectStep).toHaveBeenCalledWith(0)
});