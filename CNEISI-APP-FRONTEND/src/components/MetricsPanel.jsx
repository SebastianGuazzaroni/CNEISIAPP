import React from 'react'
import SectionTitle from './SectionTitle'

export default function MetricsPanel() {
  return (
    <div className="metrics-panel">
      <SectionTitle>MÉTRICAS</SectionTitle>
      <div className="metric-row">
        <span>Participantes</span>
        <strong>97</strong>
      </div>
      <div className="metric-row">
        <span>Charlas</span>
        <strong>6</strong>
      </div>
      <div className="metric-row">
        <span>Inscripciones</span>
        <strong>24</strong>
      </div>
    </div>
  )
}
