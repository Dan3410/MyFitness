import React from 'react';
import ReactDOM from 'react-dom';
import MFDate from './mf-date';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MFDate />, div);
  ReactDOM.unmountComponentAtNode(div);
});