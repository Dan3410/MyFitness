import { render } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import HeightSection from './height-section';
import { userFixture } from '../../../../test/userFixture'

it('renders the height control and its current value', () => {
  render(<HeightSection edit handleChange={vi.fn()} form={userFixture} />)

  expect(document.querySelector<HTMLInputElement>('input[name="height"]')?.value).toBe('175')
  expect(document.querySelector<HTMLSelectElement>('select[name="heightUnit"]')?.value).toBe('cm')
});