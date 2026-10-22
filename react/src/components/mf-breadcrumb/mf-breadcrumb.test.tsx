import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import MFBreadcrumb from './mf-breadcrumb'

it('renders breadcrumb links and the current page', () => {
  render(
    <MemoryRouter>
      <MFBreadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Perfil' }]} />
    </MemoryRouter>,
  )

  expect(screen.getByRole('link', { name: 'Inicio' }).getAttribute('href')).toBe('/')
  expect(screen.getByText('Perfil')).toBeTruthy()
})
