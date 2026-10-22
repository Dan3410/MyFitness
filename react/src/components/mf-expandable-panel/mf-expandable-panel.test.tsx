import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import MFExpandablePanel from './mf-expandable-panel';

it('requests the next state when a controlled panel is toggled', () => {
  const onToggle = vi.fn();
  const { rerender } = render(
    <MFExpandablePanel title="Información" isOpen={false} onToggle={onToggle}>
      Detalles del panel
    </MFExpandablePanel>,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Información' }));
  expect(onToggle).toHaveBeenCalledWith(true);
  expect(screen.getByRole('button', { name: 'Información' }).getAttribute('aria-expanded')).toBe('false')

  rerender(
    <MFExpandablePanel title="Información" isOpen onToggle={onToggle}>
      Detalles del panel
    </MFExpandablePanel>,
  )
  expect(screen.getByRole('button', { name: 'Información' }).getAttribute('aria-expanded')).toBe('true')
});

it('toggles an uncontrolled panel and respects defaultOpen', () => {
  render(
    <MFExpandablePanel title="Detalles" defaultOpen>
      Panel content
    </MFExpandablePanel>,
  )

  const toggle = screen.getByRole('button', { name: 'Detalles' })
  expect(toggle.getAttribute('aria-expanded')).toBe('true')
  fireEvent.click(toggle)
  expect(toggle.getAttribute('aria-expanded')).toBe('false')
  fireEvent.click(toggle)
  expect(toggle.getAttribute('aria-expanded')).toBe('true')
})