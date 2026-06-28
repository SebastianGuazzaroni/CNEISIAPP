import React, { useState } from 'react'
import SectionTitle from './SectionTitle'

export default function ImportParticipants({ onOpenTable }) {
  const [mode, setMode] = useState('csv')

  return (
    <div className="stack-panel">
      <SectionTitle>IMPORTACIÓN DE PARTICIPANTES</SectionTitle>
      <div className="import-mode">
        <button className={mode === 'csv' ? 'selected' : ''} type="button" onClick={() => setMode('csv')}>
          <span className="line-icon">⊞</span>
          Importar CSV
        </button>
        <button className={mode === 'api' ? 'selected' : ''} type="button" onClick={() => setMode('api')}>
          <span className="line-icon">∪</span>
          Conectar API
        </button>
      </div>
      {mode === 'csv' ? (
        <>
          <label className="file-label">
            <span>Seleccionar archivo CSV</span>
            <input type="file" accept=".csv" />
          </label>
          <button className="primary-button compact" type="button" onClick={onOpenTable}>
            Seleccionar archivo
          </button>
          <div className="template-row">
            <span>plantilla_participantes.csv</span>
            <button className="icon-button blue-icon" type="button" aria-label="Descargar plantilla">
              ↓
            </button>
          </div>
        </>
      ) : (
        <>
          <label className="api-label">
            <span>URL del endpoint API</span>
            <input placeholder="https://api.ejemplo.com/participantes" />
          </label>
          <button className="icon-button blue-icon" type="button" onClick={onOpenTable} aria-label="Conectar API">
            ↥
          </button>
        </>
      )}
    </div>
  )
}
