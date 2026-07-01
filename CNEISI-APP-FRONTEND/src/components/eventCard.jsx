import React from 'react'
import { Card, Badge, Button } from 'react-bootstrap'

export default function EventCard({ event, mode, onAction }) {
  const isEnroll = mode === 'enroll'
  const isCancel = mode === 'cancel'
  const isSchedule = mode === 'schedule'
  const available = event.cupoDisponible > 0

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <Card.Title className="mb-0 fs-6 fw-bold">{event.titulo}</Card.Title>
        <Badge bg="secondary">{event.sala || 'Sala no definida'}</Badge>
      </Card.Header>
      <Card.Body>
        {event.descripcion && (
          <Card.Text className="text-muted" style={{ fontSize: '0.85rem' }}>
            {event.descripcion}
          </Card.Text>
        )}
        <dl className="mb-2" style={{ fontSize: '0.82rem' }}>
          <div className="d-flex gap-2">
            <dt className="text-muted fw-normal">Orador:</dt>
            <dd className="mb-1 fw-semibold">{event.orador}</dd>
          </div>
          <div className="d-flex gap-2">
            <dt className="text-muted fw-normal">Horario:</dt>
            <dd className="mb-1">{event.horaInicio} - {event.horaFin}</dd>
          </div>
          <div className="d-flex gap-2">
            <dt className="text-muted fw-normal">Cupo:</dt>
            <dd className="mb-0">
              <Badge bg={available ? 'success' : 'danger'}>
                {event.cupoDisponible ?? event.cupoMaximo} disponible{available ? '' : ' — Completo'}
              </Badge>
            </dd>
          </div>
        </dl>
        {isEnroll && (
          <Button
            size="sm"
            variant={available ? 'primary' : 'secondary'}
            disabled={!available}
            onClick={() => onAction?.(event)}
          >
            {available ? 'Inscribirse' : 'Completo'}
          </Button>
        )}
        {isCancel && (
          <Button size="sm" variant="outline-danger" onClick={() => onAction?.(event)}>
            Cancelar inscripción
          </Button>
        )}
        {isSchedule && (
          <Badge bg={available ? 'success' : 'secondary'}>
            {available ? 'Disponible' : 'Sin cupo'}
          </Badge>
        )}
      </Card.Body>
    </Card>
  )
}
