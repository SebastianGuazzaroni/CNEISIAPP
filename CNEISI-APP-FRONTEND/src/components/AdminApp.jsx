import React from 'react'
import SideNav from './SideNav'
import ImportParticipants from './ImportParticipants'
import ParticipantsTable from './ParticipantsTable'
import AdminForm from './AdminForm'
import TalksAdmin from './TalksAdmin'
import TalkForm from './TalkForm'
import MetricsPanel from './MetricsPanel'

export default function AdminApp(props) {
  const {
    adminForm,
    adminScreen,
    editingAdmin,
    events,
    onAddAdmin,
    onAddTalk,
    onChangeAdminForm,
    onChangeScreen,
    onChangeSearch,
    onChangeTalkForm,
    onDeleteAdmin,
    onDeleteTalk,
    onEditAdmin,
    onEditTalk,
    onSaveAdmin,
    onSaveTalk,
    participants,
    search,
    talkForm,
    isSuperadmin,
  } = props

  const navItems = isSuperadmin
    ? [
        { id: 'participants-import', label: 'Participantes' },
        { id: 'admins', label: 'ABM Admin' },
        { id: 'talks', label: 'ABM charlas' },
        { id: 'metrics', label: 'Métricas' },
      ]
    : [{ id: 'talks', label: 'ABM charlas' }]

  return (
    <div className="app-layout">
      <SideNav active={adminScreen} items={navItems} onChange={onChangeScreen} />

      <section className="content-area">
        {isSuperadmin && adminScreen === 'participants-import' ? (
          <ImportParticipants onOpenTable={() => onChangeScreen('participants-table')} />
        ) : null}
        {isSuperadmin && adminScreen === 'participants-table' ? (
          <ParticipantsTable
            rows={participants}
            search={search}
            title="PARTICIPANTES IMPORTADOS"
            onChangeSearch={onChangeSearch}
          />
        ) : null}
        {adminScreen === 'admins' && isSuperadmin ? (
          <ParticipantsTable
            actions={
              <>
                <button className="icon-button action-icon" type="button" onClick={onAddAdmin} aria-label="Añadir perfil">
                  ♁+
                </button>
                <button
                  className="icon-button action-icon"
                  type="button"
                  onClick={() => onEditAdmin(participants[0])}
                  aria-label="Editar perfil"
                >
                  ◰
                </button>
              </>
            }
            rows={participants}
            search={search}
            title="PERFILES ADMINISTRADORES"
            onChangeSearch={onChangeSearch}
            onRowClick={onEditAdmin}
          />
        ) : null}
        {adminScreen === 'admin-add' || adminScreen === 'admin-edit' ? (
          isSuperadmin ? (
            <AdminForm
              editing={Boolean(editingAdmin)}
              form={adminForm}
              onChange={onChangeAdminForm}
              onDelete={onDeleteAdmin}
              onSubmit={onSaveAdmin}
            />
          ) : (
            <div className="empty-state">Acceso restringido a administradores superiores.</div>
          )
        ) : null}
        {adminScreen === 'talks' ? (
          <TalksAdmin events={events} onAdd={onAddTalk} onEdit={onEditTalk} />
        ) : null}
        {adminScreen === 'talk-add' || adminScreen === 'talk-edit' ? (
          <TalkForm
            editing={adminScreen === 'talk-edit'}
            form={talkForm}
            onChange={onChangeTalkForm}
            onDelete={onDeleteTalk}
            onSubmit={onSaveTalk}
          />
        ) : null}
        {adminScreen === 'metrics' && isSuperadmin ? <MetricsPanel /> : null}
      </section>
    </div>
  )
}
