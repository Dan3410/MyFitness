import { render, screen, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import WeightSection from './weight-section'
import { userFixture } from '../../../../test/userFixture'
import { profileService } from '../../../../services/profileService'

it('renders the weight controls and history section', async () => {
  vi.spyOn(profileService, 'getWeightHistory').mockResolvedValue([])
  render(
    <MemoryRouter>
      <WeightSection edit handleChange={vi.fn()} form={userFixture} refreshWeightHistory={0} />
    </MemoryRouter>,
  )

  expect(document.querySelector<HTMLInputElement>('input[name="weight"]')?.value).toBe('70')
  expect(screen.getByRole('heading', { name: 'Evolución del peso' })).toBeTruthy()
  await waitFor(() => expect(profileService.getWeightHistory).toHaveBeenCalledOnce())
});