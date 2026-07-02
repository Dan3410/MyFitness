import React from 'react';
import ReactDOM from 'react-dom';
import MFFormField from './mf-form-field';
import { ComponentTheme } from '../../themes/enums';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MFFormField theme={ComponentTheme.workout}><div>Form field</div></MFFormField>, div);
  ReactDOM.unmountComponentAtNode(div);
});