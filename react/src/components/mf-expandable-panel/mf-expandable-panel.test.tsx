import React from 'react';
import ReactDOM from 'react-dom';
import MFExpandablePanel from './mf-expandable-panel';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MFExpandablePanel />, div);
  ReactDOM.unmountComponentAtNode(div);
});