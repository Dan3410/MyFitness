import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import MFNotification from './mf-notification'

it('renders the notification message and status role', () => {
  render(<MFNotification type="success" message="Profile saved" />)

  expect(screen.getByRole('status').textContent).toContain('Profile saved')
  expect(screen.getByText('✓')).toBeTruthy()
})
