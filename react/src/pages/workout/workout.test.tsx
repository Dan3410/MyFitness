import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Workout from './workout';

it('renders its nested workout route', () => {
  render(
    <MemoryRouter initialEntries={['/workout']}>
      <Routes>
        <Route path="/workout" element={<Workout />}>
          <Route index element={<p>Workout list route</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )

  expect(screen.getByText('Workout list route')).toBeTruthy()
});