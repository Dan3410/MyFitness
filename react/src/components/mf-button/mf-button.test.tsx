import React from 'react';
import ReactDOM from 'react-dom';
import MFButton from './mf-button';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MFButton />, div);
  ReactDOM.unmountComponentAtNode(div);
});