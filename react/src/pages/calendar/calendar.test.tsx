import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import Calendar from './calendar';

it('renders the loading state when no authenticated session is available', () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <Calendar />
      </MemoryRouter>
    </AuthProvider>,
  )

  expect(screen.getByText('Cargando calendario...')).toBeTruthy()
});