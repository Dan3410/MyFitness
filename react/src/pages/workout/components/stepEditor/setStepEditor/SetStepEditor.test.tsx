import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import SetStepEditor from './SetStepEditor'
import { StepType } from '../../../../../models/workoutSteps'
import { WorkoutCategory } from '../../../../../models/workoutCategories'

it('adds a nested rest step to a workout set', () => {
  const onChange = vi.fn()
  render(
    <SetStepEditor
      step={{ type: StepType.SET, repeat: 3, steps: [] }}
      workoutCategory={WorkoutCategory.GYM}
      onChange={onChange}
      onDelete={vi.fn()}
    />,
  )

  expect(screen.getByText('Este set aún no tiene pasos anidados.')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Agregar descanso' }))

  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
    steps: [expect.objectContaining({ type: StepType.REST, seconds: 30 })],
  }))
})
