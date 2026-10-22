import { render } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import PersonalDataSection from './personal-data-section';
import { userFixture } from '../../../../test/userFixture'

it('renders the profile fields with the supplied user data', () => {
  render(<PersonalDataSection edit handleChange={vi.fn()} form={userFixture} />)

  expect(document.querySelector<HTMLInputElement>('input[name="username"]')?.value).toBe('fitness-user')
  expect(document.querySelector<HTMLInputElement>('input[name="name"]')?.value).toBe('Fitness')
  expect(document.querySelector<HTMLInputElement>('input[name="lastName"]')?.value).toBe('User')
});