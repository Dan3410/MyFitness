import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import MFModal from './mf-modal';

afterEach(() => {
  cleanup()
  document.getElementById('modal-root')?.remove()
})

const renderModal = (onClose = vi.fn()) => {
  const modalRoot = document.createElement('div');
  modalRoot.id = 'modal-root';
  document.body.append(modalRoot);

  render(
    <MFModal isOpen onClose={onClose}>
      Modal content
    </MFModal>,
  );

  return onClose
}

it('renders its content in the modal root when open', () => {
  renderModal()

  expect(screen.getByRole('dialog').textContent).toContain('Modal content');
})

it('calls onClose from the close button, overlay, and Escape key', async () => {
  const onClose = renderModal()

  fireEvent.click(screen.getByRole('button', { name: 'Close' }))
  fireEvent.mouseDown(screen.getByRole('dialog'))
  fireEvent.keyDown(document, { key: 'Escape' })

  await waitFor(() => expect(onClose).toHaveBeenCalledTimes(3))
})

it('does not close when interacting inside the modal content', () => {
  const onClose = renderModal()

  fireEvent.mouseDown(screen.getByText('Modal content'))
  expect(onClose).not.toHaveBeenCalled()
})