import React from 'react';
import ReactDOM from 'react-dom';
import MFTooltip from './mf-tooltip';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MFTooltip />, div);
  ReactDOM.unmountComponentAtNode(div);
});