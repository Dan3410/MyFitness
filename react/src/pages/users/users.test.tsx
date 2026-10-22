import { render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { profileService } from '../../services/profileService'
import Users from './users'

it('shows matching users returned by the search service', async () => {
  vi.spyOn(profileService, 'searchUsers').mockResolvedValue([
    { id: 'trainer-1', name: 'Coach One', isTrainer: true },
  ])

  render(
    <MemoryRouter initialEntries={['/users?name=Coach']}>
      <Users />
    </MemoryRouter>,
  )

  expect(await screen.findByRole('button', { name: /Coach One/ })).toBeTruthy()
  expect(screen.getByText('Entrenador')).toBeTruthy()
})
