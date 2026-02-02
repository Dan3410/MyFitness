import React from 'react';
import ReactDOM from 'react-dom';
import WorkoutSwim from './workoutList';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WorkoutSwim />, div);
  ReactDOM.unmountComponentAtNode(div);
});