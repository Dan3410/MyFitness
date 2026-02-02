import React from 'react';
import ReactDOM from 'react-dom';
import WorkoutCategories from './workoutCategories';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WorkoutCategories />, div);
  ReactDOM.unmountComponentAtNode(div);
});