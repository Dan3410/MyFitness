import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import MFButton from './mf-button';

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