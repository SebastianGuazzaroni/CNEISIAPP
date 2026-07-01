import React from 'react'
import SideNav from './SideNav'
import EventCards from './EventCards'
import { useApp } from '../context/AppContext'

export default function ParticipantApp() {
  const { events, inscriptions, setConfirm, cancelInscription, enrollTalk, onChangeScreen, participantScreen } = useApp()

  const onCancel = (talk) =>
    setConfirm({
      title: `¿Desea cancelar la inscripcion a ${talk.titulo}?`,
      action: () => cancelInscription(talk),
    })

  const onEnroll = (talk) =>
    setConfirm({
      title: `¿Desea inscribirse a ${talk.titulo}?`,
      action: () => enrollTalk(talk),
    })

  return (
    <div className="app-layout">
      <SideNav
        active={participantScreen}
        items={[
          { id: 'schedule', label: 'Cronograma' },
          { id: 'enroll', label: 'Inscripciones' },
          { id: 'mine', label: 'Mis inscripciones' },
        ]}
        onChange={onChangeScreen}
      />

      <section className="content-area">
        {participantScreen === 'schedule' ? (
          <EventCards title="CRONOGRAMA" events={events} mode="schedule" />
        ) : null}
        {participantScreen === 'enroll' ? (
          <EventCards title="INSCRIPCIÓN A CHARLAS" events={events} mode="enroll" onAction={onEnroll} />
        ) : null}
        {participantScreen === 'mine' ? (
          <EventCards title="MIS INSCRIPCIONES" events={inscriptions} mode="cancel" onAction={onCancel} />
        ) : null}
      </section>
    </div>
  )
}
