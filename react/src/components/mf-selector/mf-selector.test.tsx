import React from 'react';
import ReactDOM from 'react-dom';
import MFSelector from './mf-selector';

it('renders and allows selecting multiple options', () => {
  const div = document.createElement('div');

  ReactDOM.render(
    <MFSelector
      label="Choose your goals"
      options={[
        { label: 'Strength', value: 'strength' },
        { label: 'Cardio', value: 'cardio' },
      ]}
      defaultValue={['strength']}
      onChange={() => undefined}
    />,
    div
  );

  expect(div.textContent).toContain('Choose your goals');
  expect(div.textContent).toContain('Strength');

  ReactDOM.unmountComponentAtNode(div);
});
