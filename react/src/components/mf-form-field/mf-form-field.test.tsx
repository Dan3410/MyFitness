import React from 'react';
import ReactDOM from 'react-dom';
import mf-input from './mf-input';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<mf-input />, div);
  ReactDOM.unmountComponentAtNode(div);
});