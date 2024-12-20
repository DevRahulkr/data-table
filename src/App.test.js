import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import TableWithPagination from './Table'

global.fetch = jest.fn()

const mockData = [
  {
    "s.no": 1,
    "percentage.funded": 80,
    "amt.pledged": 5000,
  },
  {
    "s.no": 2,
    "percentage.funded": 90,
    "amt.pledged": 8000,
  },
  {
    "s.no": 3,
    "percentage.funded": 70,
    "amt.pledged": 3000,
  },
  {
    "s.no": 4,
    "percentage.funded": 95,
    "amt.pledged": 15000,
  },
  {
    "s.no": 5,
    "percentage.funded": 60,
    "amt.pledged": 4000,
  },
  {
    "s.no": 6,
    "percentage.funded": 85,
    "amt.pledged": 7000,
  },
]

describe("TableWithPagination Component", () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  test("displays loading state initially", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    render(<TableWithPagination />)

    // Check if Loading text is rendered
    expect(screen.getByText(/loading.../i)).toBeInTheDocument()
  })

  test("displays error message on API failure", async () => {
    fetch.mockRejectedValueOnce(new Error("Failed to fetch data"))

    render(<TableWithPagination />)

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch data/i)).toBeInTheDocument()
    })
  })

  test("renders project data after successful fetch", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    render(<TableWithPagination />)

    // Wait for the table to render
    await waitFor(() => {
      expect(screen.getByText(/80%/i)).toBeInTheDocument()
      expect(screen.getByText(/£5,000/i)).toBeInTheDocument()
    })
  })

  test("renders pagination buttons and handles page changes", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    render(<TableWithPagination />)

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText(/80%/i)).toBeInTheDocument()
    })

    // Check that only 5 records are displayed per page
    const rows = screen.getAllByRole("row")
    expect(rows.length).toBe(6) 

    // Click the Next button
    const nextButton = screen.getByText(/next »/i)
    fireEvent.click(nextButton)

    // Verify that the second page is displayed
    await waitFor(() => {
      expect(screen.getByText(/85%/i)).toBeInTheDocument()
    })
  })

  test("renders 'Data not available' when API returns an empty response", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })

    render(<TableWithPagination />)

    await waitFor(() => {
      expect(screen.getByText(/data not available/i)).toBeInTheDocument()
    })
  })
})
