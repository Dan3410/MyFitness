import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import WorkoutEditor from './workoutEditor';

it('opens a new workout editor with the requested category', async () => {
  render(
    <MemoryRouter initialEntries={['/workout/edit/new?category=run']}>
      <Routes>
        <Route path="/workout/edit/:id" element={<WorkoutEditor />} />
      </Routes>
    </MemoryRouter>,
  )

  expect(await screen.findByRole('heading', { name: /Entrenamiento de carrera/ })).toBeTruthy()
  expect(screen.getByPlaceholderText('Escribe el nombre de la rutina')).toBeTruthy()
});