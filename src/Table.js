import React, { useState, useEffect } from "react"
import "./Table.css"

const TableWithPagination = () => {
  const [projects, setProjects] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState(5)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)


  // Calculate the total pages and current data based on pagination
  const totalPages = Math.ceil(projects.length / recordsPerPage)
  const currentData = projects.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  )

  // Function to handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Function to handle change in records per page
  const handleRecordsPerPageChange = (event) => {
    setRecordsPerPage(Number(event.target.value))
    setCurrentPage(1)
  }

  // Fetch projects data on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json"
        )
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        const data = await response.json()
        setProjects(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  return (
    <div className="table-container">
      <h2>Market Record</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : projects.length > 0 ? (
        <>
          <table className="styled-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Percentage Funded</th>
                <th>Amount Pledged</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((project, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                  <td>{project["percentage.funded"]}%</td>
                  <td>£{project["amt.pledged"].toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)}>
              &laquo; Prev
            </button>

             {/* Dropdown for selecting records per page  */}
            <select
              value={recordsPerPage}
              onChange={handleRecordsPerPageChange}
              className="records-per-page-dropdown"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
            </select>

            <button onClick={() => handlePageChange(currentPage + 1)}>
              Next &raquo;
            </button>
          </div>
        </>
      ) : (
        <p>Data not available</p>
      )}
    </div>
  )
}

export default TableWithPagination
