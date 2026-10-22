import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import MFError from './mf-error';

it('shows an error message when it is not hidden', () => {
  render(<MFError hidden={false}>Campo obligatorio</MFError>);

  expect(screen.getByText('Campo obligatorio').hasAttribute('hidden')).toBe(false);
});

it('hides the error when hidden is true', () => {
  render(<MFError hidden>Campo obligatorio</MFError>)

  expect(screen.getByText('Campo obligatorio').hasAttribute('hidden')).toBe(true)
})