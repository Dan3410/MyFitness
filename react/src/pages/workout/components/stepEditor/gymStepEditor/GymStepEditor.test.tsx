import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import GymStepEditor from './GymStepEditor'
import { StepType } from '../../../../../models/workoutSteps'
import { WorkoutCategory } from '../../../../../models/workoutCategories'

it('edits gym exercise fields and supports deletion', () => {
  const onChange = vi.fn()
  const onDelete = vi.fn()
  render(
    <GymStepEditor
      step={{ type: StepType.EXERCISE, exercise: 'Squat', byTime: false, reps: 8, time: 0, weight: 60 }}
      workoutCategory={WorkoutCategory.GYM}
      onChange={onChange}
      onDelete={onDelete}
    />,
  )

  expect(screen.getByRole('heading', { name: 'Editar ejercicio' })).toBeTruthy()
  fireEvent.change(screen.getByDisplayValue('Squat'), { target: { value: 'Deadlift' } })
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ exercise: 'Deadlift' }))

  fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))
  expect(onDelete).toHaveBeenCalledOnce()
})
