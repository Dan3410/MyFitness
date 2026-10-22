import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import Login from './login'

it('requires credentials and switches between sign-in and registration', () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthProvider>,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
  expect(screen.getByText('El email y la contraseña son obligatorios')).toBeTruthy()

  fireEvent.click(screen.getByRole('button', { name: 'Crear una cuenta nueva' }))
  expect(screen.getByRole('heading', { name: 'Crea tu espacio' })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeTruthy()
})
