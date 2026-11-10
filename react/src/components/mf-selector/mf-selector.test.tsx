import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import MFSelector from './mf-selector';

it('renders and allows selecting multiple options', () => {
  const onChange = vi.fn();
  render(
    <MFSelector
      label="Choose your goals"
      theme="primary"
      options={[
        { label: 'Strength', value: 'strength' },
        { label: 'Cardio', value: 'cardio' },
      ]}
      defaultValue={['strength']}
      multiple
      onChange={onChange}
    />,
  );

  expect(screen.getByRole('button', { name: 'Strength' }).className).toContain('selected');
  fireEvent.click(screen.getByRole('button', { name: 'Cardio' }));
  expect(onChange).toHaveBeenCalledWith(['strength', 'cardio']);
});

it('reports single selections and blocks selection when disabled', () => {
  const onChange = vi.fn()
  const { unmount } = render(
    <MFSelector
      theme="primary"
      options={[
        { label: 'Strength', value: 'strength' },
        { label: 'Cardio', value: 'cardio' },
      ]}
      value="strength"
      onChange={onChange}
    />,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Cardio' }))
  expect(onChange).toHaveBeenCalledWith('cardio')
  unmount()

  const disabledOnChange = vi.fn()
  render(
    <MFSelector
      theme="primary"
      options={[{ label: 'Strength', value: 'strength' }]}
      value="strength"
      disabled
      onChange={disabledOnChange}
    />,
  )
  const option = screen.getByRole('button', { name: 'Strength' }) as HTMLButtonElement
  expect(option.disabled).toBe(true)
  fireEvent.click(option)
  expect(disabledOnChange).not.toHaveBeenCalled()
})

it('reflects controlled value changes from the parent', () => {
  const onChange = vi.fn()
  const { rerender } = render(
    <MFSelector
      theme="primary"
      options={[
        { label: 'Strength', value: 'strength' },
        { label: 'Cardio', value: 'cardio' },
      ]}
      value="strength"
      onChange={onChange}
    />,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Cardio' }))
  expect(onChange).toHaveBeenCalledWith('cardio')
  expect(screen.getByRole('button', { name: 'Strength' }).className).toContain('selected')

  rerender(
    <MFSelector
      theme="primary"
      options={[
        { label: 'Strength', value: 'strength' },
        { label: 'Cardio', value: 'cardio' },
      ]}
      value="cardio"
      onChange={onChange}
    />,
  )
  expect(screen.getByRole('button', { name: 'Cardio' }).className).toContain('selected')
})
