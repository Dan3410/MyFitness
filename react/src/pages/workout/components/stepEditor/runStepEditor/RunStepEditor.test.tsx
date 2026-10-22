import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import RunStepEditor from './RunStepEditor'
import { StepType } from '../../../../../models/workoutSteps'

it('renders running fields and reports distance changes', () => {
  const onChange = vi.fn()
  render(
    <RunStepEditor
      step={{ type: StepType.RUNTIME, distance: 1000, calories: 0, time: 300, speed: 12 }}
      onChange={onChange}
      onDelete={vi.fn()}
    />,
  )

  expect(screen.getByRole('heading', { name: 'Editar paso de carrera' })).toBeTruthy()
  fireEvent.change(screen.getByDisplayValue('1000'), { target: { value: '1500' } })
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ distance: 1500 }))
  expect(screen.getByDisplayValue('300')).toBeTruthy()
})
