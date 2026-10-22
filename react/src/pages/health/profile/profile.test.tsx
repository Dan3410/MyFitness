import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../../context/AuthContext'
import { GET_DATA_ERROR_MESSAGE } from '../../../const/errorMessages'
import { profileService } from '../../../services/profileService'
import { trainerStudentService } from '../../../services/trainerStudentService'
import { userFixture } from '../../../test/userFixture'
import Profile from './profile';

vi.mock('../components/weight-section/weight-section', () => ({
  default: () => <div>Weight section</div>,
}))

afterEach(() => {
  vi.restoreAllMocks()
})

const renderProfile = () => {
  vi.spyOn(profileService, 'getUserData').mockResolvedValue({ ...userFixture })
  vi.spyOn(profileService, 'getWeightHistory').mockResolvedValue([])
  vi.spyOn(trainerStudentService, 'getRelationshipsForProfile').mockResolvedValue([])

  return render(
    <AuthProvider>
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    </AuthProvider>,
  )
}

it('shows an error when profile data cannot be loaded', async () => {
  vi.spyOn(profileService, 'getUserData').mockRejectedValue(new Error('request failed'))
  render(
    <AuthProvider>
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    </AuthProvider>,
  )

  expect(await screen.findByText(GET_DATA_ERROR_MESSAGE)).toBeTruthy()
});

it('enables profile fields when Edit is clicked and restores them when cancelled', async () => {
  renderProfile()

  const nameInput = await screen.findByDisplayValue(userFixture.name) as HTMLInputElement
  expect(nameInput.disabled).toBe(true)

  fireEvent.click(screen.getByRole('button', { name: 'Editar' }))
  const editableNameInput = document.querySelector<HTMLInputElement>('input[name="name"]')
  expect(editableNameInput?.disabled).toBe(false)

  fireEvent.change(editableNameInput!, { target: { value: 'Updated name' } })
  expect(editableNameInput?.value).toBe('Updated name')

  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
  await waitFor(() => expect(document.querySelector<HTMLInputElement>('input[name="name"]')?.value).toBe(userFixture.name))
  expect(document.querySelector<HTMLInputElement>('input[name="name"]')?.disabled).toBe(true)
  expect(screen.getByRole('button', { name: 'Editar' })).toBeTruthy()
})

it('saves edited profile data and displays a success notification', async () => {
  const updatedUser = { ...userFixture, name: 'Updated name' }
  const editUserData = vi.spyOn(profileService, 'editUserData').mockResolvedValue(updatedUser)
  renderProfile()

  await screen.findByDisplayValue(userFixture.name)
  fireEvent.click(screen.getByRole('button', { name: 'Editar' }))
  fireEvent.change(document.querySelector<HTMLInputElement>('input[name="name"]')!, {
    target: { value: updatedUser.name },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Guardar' }))

  await waitFor(() => expect(editUserData).toHaveBeenCalledOnce())
  expect(editUserData.mock.calls[0][0].name).toBe(updatedUser.name)
  expect(await screen.findByText('Perfil guardado correctamente')).toBeTruthy()
  expect(screen.getByDisplayValue(updatedUser.name)).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Editar' })).toBeTruthy()
})