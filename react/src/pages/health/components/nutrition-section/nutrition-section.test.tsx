import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import NutritionSection from './nutrition-section';

import { userFixture } from '../../../../test/userFixture'

it('calculates and displays nutrition targets from the user profile', () => {
  render(<NutritionSection form={userFixture} />)

  expect(screen.getByText(/Proteinas/).textContent).toContain('Entre 84g - 112g')
  expect(screen.getAllByText(/Carbohidratos/)
    .some((element) => element.textContent?.includes('Entre 350g - 455g'))).toBe(true)
});