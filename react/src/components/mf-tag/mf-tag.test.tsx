import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import styles from './mf-tag.module.scss'
import MFTag from './mf-tag'

it('uses the primary theme by default', () => {
  render(<MFTag>Example</MFTag>)

  expect(screen.getByText('Example').className).toContain(styles['MFTag--Primary'])
})

it('supports a specified theme and additional class name', () => {
  render(<MFTag theme="secondary" className="TestTag__Custom">Example</MFTag>)

  const tag = screen.getByText('Example')
  expect(tag.className).toContain(styles['MFTag--Secondary'])
  expect(tag.className).toContain('TestTag__Custom')
})
