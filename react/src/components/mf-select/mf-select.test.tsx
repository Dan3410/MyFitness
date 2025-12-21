import React from 'react';
import ReactDOM from 'react-dom';
import mf-select from './mf-select';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<mf-select />, div);
  ReactDOM.unmountComponentAtNode(div);
});