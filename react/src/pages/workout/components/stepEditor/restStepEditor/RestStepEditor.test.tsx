import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import RestStepEditor from './RestStepEditor'
import { StepType } from '../../../../../models/workoutSteps'

it('updates rest duration and invokes delete', () => {
  const onChange = vi.fn()
  const onDelete = vi.fn()
  render(
    <RestStepEditor
      step={{ type: StepType.REST, seconds: 30 }}
      onChange={onChange}
      onDelete={onDelete}
    />,
  )

  fireEvent.change(screen.getByDisplayValue('30'), { target: { value: '45' } })
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ seconds: 45 }))
  fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))
  expect(onDelete).toHaveBeenCalledOnce()
})
