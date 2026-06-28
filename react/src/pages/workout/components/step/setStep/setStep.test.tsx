import React from 'react';
import ReactDOM from 'react-dom';
import SetStep from './setStep';

it('renders the set step component', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <SetStep
      step={{ type: 'SET', repeat: 3, steps: [{ type: 'REST', seconds: 30 }] }}
      workoutCategory="gym"
    />,
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
});
