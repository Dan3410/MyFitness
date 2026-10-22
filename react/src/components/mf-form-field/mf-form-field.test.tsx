import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import MFFormField from './mf-form-field';
import { ComponentTheme } from '../../models/componentTheme';

it('renders its form control children', () => {
  render(
    <MFFormField theme={ComponentTheme.workout}>
      <label htmlFor="username">Username</label>
      <input id="username" />
    </MFFormField>,
  );

  expect(screen.getByLabelText('Username')).toBeTruthy();
});

it('disables nested form controls when disabled', () => {
  render(
    <MFFormField theme={ComponentTheme.workout} disabled>
      <label htmlFor="disabled-username">Username</label>
      <input id="disabled-username" />
      <div>
        <label htmlFor="disabled-category">Category</label>
        <select id="disabled-category"><option>Gym</option></select>
      </div>
    </MFFormField>,
  )

  expect((screen.getByLabelText('Username') as HTMLInputElement).disabled).toBe(true)
  expect((screen.getByLabelText('Category') as HTMLSelectElement).disabled).toBe(true)
})

it('preserves controls that are individually disabled', () => {
  render(
    <MFFormField theme={ComponentTheme.workout}>
      <button type="button" disabled>Unavailable</button>
    </MFFormField>,
  )

  expect((screen.getByRole('button', { name: 'Unavailable' }) as HTMLButtonElement).disabled).toBe(true)
})