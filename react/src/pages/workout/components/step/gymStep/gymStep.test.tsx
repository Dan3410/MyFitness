import React from 'react';
import ReactDOM from 'react-dom';
import GymStep from './gymStep';

it('renders the gym step component', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <GymStep step={{ type: 'GYM_EXERCISE', exercise: 'Bench Press', byTime: false, reps: 8, time: 0, weight: 70 }} />,
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
});
