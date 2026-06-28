import React from 'react'
import SectionTitle from './SectionTitle'

export default function ParticipantsTable({ actions, rows, search, title, onChangeSearch, onRowClick }) {
  const filteredRows = rows.filter((row) => {
    const needle = search.trim().toLowerCase()
    if (!needle) return true
    return `${row.nombreApellido} ${row.email} ${row.legajo}`.toLowerCase().includes(needle)
  })

  return (
    <div className="table-view">
      <SectionTitle>{title}</SectionTitle>
      <div className="table-shell">
        <div className="table-toolbar">
          <button className="icon-button table-tool" type="button" aria-label="Filtrar">
            ▼
          </button>
          <label className="search-box">
            <span>⌕</span>
            <input placeholder="Search..." value={search} onChange={(event) => onChangeSearch(event.target.value)} />
          </label>
          <div className="table-actions">
            {actions}
            <button className="icon-button action-icon" type="button" aria-label="Descargar">
              ↓
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox" aria-label="Seleccionar todos" />
              </th>
              <th># ↕</th>
              <th>NOMBRE ↕</th>
              <th>EMAIL</th>
              <th>LEGAJO</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.slice(0, 8).map((row, index) => (
              <tr key={row.id} onClick={() => onRowClick?.(row)}>
                <td>
                  <input type="checkbox" aria-label={`Seleccionar ${row.nombreApellido}`} />
                </td>
                <td>{index + 1}</td>
                <td>{row.nombreApellido}</td>
                <td>{row.email}</td>
                <td>{row.legajo}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <span>1-10 of 97</span>
          <span>Rows per page: 10⌄</span>
          <span>‹ 1/10 ›</span>
        </div>
      </div>
    </div>
  )
}
