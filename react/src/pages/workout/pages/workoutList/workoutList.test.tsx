import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import WorkoutList from './workoutList';

it('renders the create workout button', () => {
  const div = document.createElement('div');
  const root = createRoot(div);

  root.render(
    <MemoryRouter>
      <WorkoutList />
    </MemoryRouter>
  );

  expect(div.textContent).toContain('Crear rutina');
  root.unmount();
});