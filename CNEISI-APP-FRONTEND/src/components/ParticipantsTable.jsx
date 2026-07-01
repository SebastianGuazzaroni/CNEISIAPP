import React from 'react'
import { Table, Form, InputGroup, Button, Badge } from 'react-bootstrap'
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
      <div className="d-flex justify-content-between align-items-center mb-2 gap-2 flex-wrap">
        <InputGroup size="sm" style={{ maxWidth: 240 }}>
          <InputGroup.Text>⌕</InputGroup.Text>
          <Form.Control
            placeholder="Buscar..."
            value={search}
            onChange={(e) => onChangeSearch(e.target.value)}
          />
        </InputGroup>
        <div className="d-flex gap-1">
          {actions}
          <Button size="sm" variant="outline-secondary" aria-label="Descargar">↓</Button>
        </div>
      </div>
      <Table hover responsive size="sm" className="align-middle" style={{ fontSize: '0.82rem' }}>
        <thead className="table-light">
          <tr>
            <th><Form.Check type="checkbox" aria-label="Seleccionar todos" /></th>
            <th>#</th>
            <th>NOMBRE</th>
            <th>EMAIL</th>
            <th>LEGAJO</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.slice(0, 8).map((row, index) => (
            <tr
              key={row.id}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              onClick={() => onRowClick?.(row)}
            >
              <td><Form.Check type="checkbox" aria-label={`Seleccionar ${row.nombreApellido}`} /></td>
              <td>{index + 1}</td>
              <td className="fw-semibold">{row.nombreApellido}</td>
              <td className="text-muted">{row.email}</td>
              <td><Badge bg="light" text="dark">{row.legajo}</Badge></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="text-muted text-end" style={{ fontSize: '0.78rem' }}>
        Mostrando {Math.min(filteredRows.length, 8)} de {filteredRows.length} resultados
      </div>
    </div>
  )
}
