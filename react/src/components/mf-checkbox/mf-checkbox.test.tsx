import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import MFCheckbox from './mf-checkbox'

it('renders its checked state and reports changes', () => {
  const onChange = vi.fn()
  render(<MFCheckbox checked onChange={onChange}>Share workout</MFCheckbox>)

  const checkbox = screen.getByRole('checkbox') as HTMLInputElement
  expect(checkbox.checked).toBe(true)

  fireEvent.click(checkbox)
  expect(onChange).toHaveBeenCalledOnce()
})

it('prevents interaction when disabled', () => {
  render(<MFCheckbox disabled>Private profile</MFCheckbox>)

  const checkbox = screen.getByRole('checkbox') as HTMLInputElement
  expect(checkbox.disabled).toBe(true)
})
