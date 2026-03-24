import React from 'react';
import ReactDOM from 'react-dom';
import Step from './step';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Step />, div);
  ReactDOM.unmountComponentAtNode(div);
});