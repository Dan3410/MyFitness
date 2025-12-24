import React from 'react';
import ReactDOM from 'react-dom';
import MFError from './mf-error';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MFError />, div);
  ReactDOM.unmountComponentAtNode(div);
});