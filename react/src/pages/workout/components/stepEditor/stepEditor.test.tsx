import { createRoot } from 'react-dom/client';
import StepEditor from './stepEditor';
import { RestStep, StepType } from '../../../../models/workoutSteps';

it('renders the selected step details', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const step: RestStep = { type: StepType.REST, seconds: 45 };
  const root = createRoot(div);

  root.render(
    <StepEditor step={step} workoutCategory="gym" onChange={() => {}} onDelete={() => {}} />,
  );

  expect(div.textContent).toContain('Editar paso');
  expect(div.textContent).toContain('Segundos');

  root.unmount();
  div.remove();
});