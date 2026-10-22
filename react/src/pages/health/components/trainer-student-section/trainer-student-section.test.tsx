import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import TrainerStudentSection from './trainer-student-section'

const relationships = [
  { id: 'trainer-1', name: 'Coach One', isTrainer: true, relationshipType: 'TRAINER' as const },
  { id: 'student-1', name: 'Athlete One', isTrainer: false, relationshipType: 'STUDENT' as const },
]

it('renders trainer and student relationships and reports selection changes', () => {
  const onSelectionChange = vi.fn()
  render(
    <TrainerStudentSection
      isTrainer
      isOwner
      edit
      users={relationships}
      selectedUserIds={['TRAINER:trainer-1', 'STUDENT:student-1']}
      onSelectionChange={onSelectionChange}
    />,
  )

  expect(screen.getByText('Tus entrenadores')).toBeTruthy()
  expect(screen.getByText('Tus alumnos')).toBeTruthy()
  expect(screen.getByText('Coach One')).toBeTruthy()
  expect(screen.getByText('Athlete One')).toBeTruthy()

  const studentCheckbox = screen.getAllByRole('checkbox')[1] as HTMLInputElement
  fireEvent.click(studentCheckbox)
  expect(onSelectionChange).toHaveBeenCalledWith(relationships[1], false)
})
