import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { SESSION_STORAGE_KEY } from '../../services/authService'
import { notificationService } from '../../services/notificationService'
import MFHeader from './mf-header';

afterEach(() => {
  localStorage.removeItem(SESSION_STORAGE_KEY)
  vi.restoreAllMocks()
})

it('renders the application header', () => {
  const { container } = render(
    <AuthProvider>
      <MemoryRouter>
        <MFHeader />
      </MemoryRouter>
    </AuthProvider>,
  );
  expect(container.firstElementChild).toBeTruthy();
});

it('opens the main menu and displays its navigation actions', async () => {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
    token: 'test-token',
    userId: 'user-1',
    email: 'fitness@example.com',
    name: 'Fitness',
    lastName: 'User',
  }))
  vi.spyOn(notificationService, 'getNotifications').mockResolvedValue([])
  render(
    <AuthProvider>
      <MemoryRouter>
        <MFHeader />
      </MemoryRouter>
    </AuthProvider>,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Abrir menú principal' }))
  expect(screen.getByRole('button', { name: 'Abrir menú principal' }).getAttribute('aria-expanded')).toBe('true')
  expect(screen.getByRole('menuitem', { name: 'Calendario' })).toBeTruthy()
  expect(screen.getByRole('menuitem', { name: 'Rutina de ejercicios' })).toBeTruthy()
})