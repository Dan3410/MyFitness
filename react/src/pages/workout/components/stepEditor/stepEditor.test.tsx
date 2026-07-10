import ReactDOM from 'react-dom';
import StepEditor from './stepEditor';
import { stepType } from '../../../../models/workoutSteps';

it('renders the selected step details', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const step = { type: stepType.REST, seconds: 45 };

  ReactDOM.render(
    <StepEditor step={step} workoutCategory="gym" onChange={() => {}} onDelete={() => {}} />,
    div,
  );

  expect(div.textContent).toContain('Editar paso');
  expect(div.textContent).toContain('Segundos');

  ReactDOM.unmountComponentAtNode(div);
  div.remove();
});