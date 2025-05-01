import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useNavigate } from 'react-router-dom'
import Unauthorized from '../../pages/Unauthorized'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}))

describe('Unauthorized Page', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders heading, message and Go to Home button', () => {
    render(<Unauthorized />)

    expect(
      screen.getByRole('heading', { level: 3, name: /unauthorized/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { level: 6, name: /you do not have permission to view this page\./i })
    ).toBeInTheDocument()

    const btn = screen.getByRole('button', { name: /go to home/i })
    expect(btn).toBeInTheDocument()
  })

  it('navigates to home on button click', () => {
    render(<Unauthorized />)

    const btn = screen.getByRole('button', { name: /go to home/i })
    fireEvent.click(btn)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
