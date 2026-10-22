import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import SwimStepEditor from './SwimStepEditor'
import { StepType, SwimStroke } from '../../../../../models/workoutSteps'

it('renders swimming controls and reports stroke changes', () => {
  const onChange = vi.fn()
  render(
    <SwimStepEditor
      step={{ type: StepType.SWIMTIME, distance: 0, time: 60, gear: [], stroke: SwimStroke.CHOICE }}
      onChange={onChange}
      onDelete={vi.fn()}
    />,
  )

  expect(screen.getByRole('heading', { name: 'Editar paso de natación' })).toBeTruthy()
  expect(screen.getByText('Estilo')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: SwimStroke.FREESTYLE }))
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ stroke: SwimStroke.FREESTYLE }))
})
