import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import MFTooltip from './mf-tooltip';
import { ComponentTheme } from '../../models/componentTheme';

it('renders its tooltip text and a focusable trigger', () => {
  render(
    <MFTooltip theme={ComponentTheme.workout}>
      Help text
    </MFTooltip>,
  );

  expect(screen.getByRole('tooltip').textContent).toBe('Help text');
  expect(screen.getByText('?').getAttribute('tabindex')).toBe('0');
});

afterEach(() => {
  vi.useRealTimers()
})

it('shows the tooltip after its delay and hides it when the pointer leaves', async () => {
  vi.useFakeTimers()
  render(
    <MFTooltip theme={ComponentTheme.workout} delay={50}>
      Delayed help
    </MFTooltip>,
  )

  const trigger = screen.getByText('?')
  const tooltip = screen.getByRole('tooltip')
  fireEvent.mouseEnter(trigger)

  await act(async () => {
    vi.advanceTimersByTime(50)
  })
  expect(tooltip.style.opacity).toBe('1')

  fireEvent.mouseLeave(trigger)
  expect(tooltip.style.opacity).toBe('0')
})