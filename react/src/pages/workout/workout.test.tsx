import React from 'react';
import ReactDOM from 'react-dom';
import Workout from './workout';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Workout />, div);
  ReactDOM.unmountComponentAtNode(div);
});