import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import MFButton from './mf-button';
import styles from './mf-button.module.scss';

it('renders its label and calls the click handler', () => {
  const onClickEvent = vi.fn();
  render(<MFButton onClickEvent={onClickEvent}>Guardar</MFButton>);

  fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
  expect(onClickEvent).toHaveBeenCalledOnce();
});

it('applies button attributes and ignores clicks when disabled', () => {
  const onClickEvent = vi.fn();
  render(
    <MFButton
      type="submit"
      isDisabled
      width="100%"
      height="40px"
      fontSize="16px"
      onClickEvent={onClickEvent}
    >
      Submit
    </MFButton>,
  );

  const button = screen.getByRole('button', { name: 'Submit' }) as HTMLButtonElement;
  expect(button.disabled).toBe(true);
  expect(button.type).toBe('submit');
  expect(button.style.width).toBe('100%');
  expect(button.style.height).toBe('40px');
  expect(button.style.fontSize).toBe('16px');

  fireEvent.click(button);
  expect(onClickEvent).not.toHaveBeenCalled();
});

it('forwards accessibility attributes and a custom class name', () => {
  render(
    <MFButton
      aria-expanded="true"
      aria-haspopup="menu"
      className="TestMenu__Trigger"
    >
      Menu
    </MFButton>,
  );

  const button = screen.getByRole('button', { name: 'Menu' });
  expect(button.getAttribute('aria-expanded')).toBe('true');
  expect(button.getAttribute('aria-haspopup')).toBe('menu');
  expect(button.className).toContain('TestMenu__Trigger');
});

it('supports the primary, secondary, and tertiary color variants', () => {
  const { rerender } = render(<MFButton theme="primary">Primary</MFButton>);
  const button = screen.getByRole('button', { name: 'Primary' });

  expect(button.className).toContain(styles['MFButton--Primary']);

  rerender(<MFButton theme="secondary">Secondary</MFButton>);
  expect(screen.getByRole('button', { name: 'Secondary' }).className).toContain(styles['MFButton--Secondary']);

  rerender(<MFButton theme="tertiary">Tertiary</MFButton>);
  expect(screen.getByRole('button', { name: 'Tertiary' }).className).toContain(styles['MFButton--Tertiary']);
});