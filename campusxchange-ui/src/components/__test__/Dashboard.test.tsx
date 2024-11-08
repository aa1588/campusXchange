import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Dashboard from '../Dashboard'
import '@testing-library/jest-dom'

describe('Dashboard Component', () => {
    test('renders Dashboard header', () => {
        render(<Dashboard />)
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    test('renders Reset Password button', () => {
        render(<Dashboard />)
        const resetButton = screen.getByText('Reset Password')
        expect(resetButton).toBeInTheDocument()
        expect(resetButton).toHaveClass('btn-outline-success')
    })

    test('renders Add Item For Sale button', () => {
        render(<Dashboard />)
        const addButton = screen.getByText('Add Item For Sale +')
        expect(addButton).toBeInTheDocument()
        expect(addButton).toHaveClass('btn-success')
    })

    test('renders item card with correct title', () => {
        render(<Dashboard />)
        expect(screen.getByText('Dell Chromebook 3180')).toBeInTheDocument()
    })

    test('renders offers table with correct headers', () => {
        render(<Dashboard />)
        expect(screen.getByText('Id')).toBeInTheDocument()
        expect(screen.getByText('FROM')).toBeInTheDocument()
        expect(screen.getByText('CONTACT')).toBeInTheDocument()
        expect(screen.getByText('OFFER PRICE')).toBeInTheDocument()
        expect(screen.getByText('ACTION')).toBeInTheDocument()
    })

    test('renders offer row with correct data', () => {
        render(<Dashboard />)
        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('sam@my.unt.edu')).toBeInTheDocument()
        expect(screen.getByText('Unavailable')).toBeInTheDocument()
        expect(screen.getByText('$325.00')).toBeInTheDocument()
    })

    test('renders Accept and Decline buttons in offer row', () => {
        render(<Dashboard />)
        const acceptButton = screen.getAllByText('Accept')[0]
        const declineButton = screen.getAllByText('Decline')[0]

        expect(acceptButton).toBeInTheDocument()
        expect(declineButton).toBeInTheDocument()

        fireEvent.click(acceptButton)
        fireEvent.click(declineButton)

        expect(acceptButton).toHaveClass('btn-success')
        expect(declineButton).toHaveClass('btn-danger')
    })
})
