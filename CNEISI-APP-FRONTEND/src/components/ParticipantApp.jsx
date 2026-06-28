import React from 'react'
import SideNav from './SideNav'
import EventCards from './EventCards'

export default function ParticipantApp({ events, inscriptions, onCancel, onChangeScreen, onEnroll, screen }) {
  return (
    <div className="app-layout">
      <SideNav
        active={screen}
        items={[
          { id: 'schedule', label: 'Cronograma' },
          { id: 'enroll', label: 'Inscripciones' },
          { id: 'mine', label: 'Mis inscripciones' },
        ]}
        onChange={onChangeScreen}
      />

      <section className="content-area">
        {screen === 'schedule' ? (
          <EventCards title="CRONOGRAMA" events={events} mode="schedule" />
        ) : null}
        {screen === 'enroll' ? (
          <EventCards title="INSCRIPCIÓN A CHARLAS" events={events} mode="enroll" onAction={onEnroll} />
        ) : null}
        {screen === 'mine' ? (
          <EventCards title="MIS INSCRIPCIONES" events={inscriptions} mode="cancel" onAction={onCancel} />
        ) : null}
      </section>
    </div>
  )
}
