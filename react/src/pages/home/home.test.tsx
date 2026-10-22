import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import Home from './home';

it('renders the upcoming workouts heading', () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </AuthProvider>,
  )

  expect(screen.getByRole('heading', { name: 'Próximas rutinas' })).toBeTruthy()
});