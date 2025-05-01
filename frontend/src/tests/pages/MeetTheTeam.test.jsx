// frontend/src/tests/pages/MeetTheTeam.test.jsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import MeetTheTeam from '../../pages/MeetTheTeam'

describe('MeetTheTeam Page', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{
        fullName: 'Test User',
        title: 'Tester',
        imageUrl: '/test.jpg',
        description: 'This is a test description.'
      }]),
    })
  })

  afterEach(() => {
    delete global.fetch
    jest.restoreAllMocks()
  })

  it('shows loading spinner then renders team grid', async () => {
    render(<MeetTheTeam />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())
    expect(screen.getByText('Tester')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', '/test.jpg')
  })

  it('renders header, subtext and navigation links', async () => {
    render(<MeetTheTeam />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    expect(
      screen.getByRole('heading', { level: 3, name: /meet the team/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/meet our team of professionals to serve you/i)
    ).toBeInTheDocument()

    const aboutLink = screen.getByRole('link', { name: /about us/i })
    expect(aboutLink).toHaveAttribute('href', '/about-us')

    const contactLink = screen.getByRole('link', { name: /contact us/i })
    expect(contactLink).toHaveAttribute('href', '/contact-us')
  })

  it('expands and collapses a member description', async () => {
    render(<MeetTheTeam />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

    const expandBtn = screen.getByLabelText(/show more/i)

    // Initially it's unmounted
    expect(screen.queryByText(/this is a test description/i)).toBeNull()

    // Expand
    fireEvent.click(expandBtn)
    await waitFor(() =>
      expect(screen.getByText(/this is a test description/i)).toBeVisible()
    )

    // Collapse
    fireEvent.click(expandBtn)
    await waitFor(() =>
      expect(screen.queryByText(/this is a test description/i)).toBeNull()
    )
  })

  it('falls back to mock data on fetch error', async () => {
    global.fetch.mockImplementation(() => Promise.reject(new Error('fail')))
    render(<MeetTheTeam />)
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())
    expect(
      screen.getByText(/Co-Owner & Hairstylist/i)
    ).toBeInTheDocument()
  })
})
