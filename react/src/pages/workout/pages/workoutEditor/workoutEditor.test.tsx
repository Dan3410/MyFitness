import React from 'react';
import ReactDOM from 'react-dom';
import WorkoutEditor from './workoutEditor';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WorkoutEditor />, div);
  ReactDOM.unmountComponentAtNode(div);
});