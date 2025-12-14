import React from 'react';
import ReactDOM from 'react-dom';
import WorkoutList from './workoutList';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WorkoutList />, div);
  ReactDOM.unmountComponentAtNode(div);
});