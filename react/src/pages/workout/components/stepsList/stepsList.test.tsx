import React from 'react';
import ReactDOM from 'react-dom';
import StepsList from './stepsList';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<StepsList />, div);
  ReactDOM.unmountComponentAtNode(div);
});