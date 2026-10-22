import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import MFSpinner from './mf-spinner'

it('announces its loading label to assistive technology', () => {
  render(<MFSpinner label="Loading workouts" />)

  expect(screen.getByRole('status', { name: 'Loading workouts' })).toBeTruthy()
})
