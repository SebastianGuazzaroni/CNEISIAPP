import React from 'react'
import SideNav from './SideNav'
import ImportParticipants from './ImportParticipants'
import ParticipantsTable from './ParticipantsTable'
import AdminForm from './AdminForm'
import TalksAdmin from './TalksAdmin'
import TalkForm from './TalkForm'
import MetricsPanel from './MetricsPanel'
import { useApp } from '../context/AppContext'

export default function AdminApp() {
  const {
    role,
    adminForm,
    adminScreen,
    editingAdmin,
    events,
    openAddAdmin,
    openAddTalk,
    setAdminForm,
    onChangeScreen,
    setSearch,
    setTalkForm,
    openEditAdmin,
    openEditTalk,
    saveAdmin,
    saveTalk,
    participants,
    search,
    talkForm,
    setConfirm,
    deleteTalk,
  } = useApp()

  const isSuperadmin = role === 'superadmin'

  const navItems = isSuperadmin
    ? [
        { id: 'participants-import', label: 'Participantes' },
        { id: 'admins', label: 'ABM Admin' },
        { id: 'talks', label: 'ABM charlas' },
        { id: 'metrics', label: 'Métricas' },
      ]
    : [{ id: 'talks', label: 'ABM charlas' }]

  const onDeleteAdmin = () =>
    setConfirm({
      title: '¿Desea eliminar este perfil?',
      action: () => {
        setConfirm(null)
        setConfirm({ title: '', action: null })
      },
    })

  const onDeleteTalk = () =>
    setConfirm({
      title: '¿Desea eliminar esta charla?',
      action: deleteTalk,
    })

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
            onChangeSearch={setSearch}
          />
        ) : null}
        {adminScreen === 'admins' && isSuperadmin ? (
          <ParticipantsTable
            actions={
              <>
                <button className="icon-button action-icon" type="button" onClick={openAddAdmin} aria-label="Añadir perfil">
                  ♁+
                </button>
                <button
                  className="icon-button action-icon"
                  type="button"
                  onClick={() => openEditAdmin(participants[0])}
                  aria-label="Editar perfil"
                >
                  ◰
                </button>
              </>
            }
            rows={participants}
            search={search}
            title="PERFILES ADMINISTRADORES"
            onChangeSearch={setSearch}
            onRowClick={openEditAdmin}
          />
        ) : null}
        {adminScreen === 'admin-add' || adminScreen === 'admin-edit' ? (
          isSuperadmin ? (
            <AdminForm
              editing={Boolean(editingAdmin)}
              form={adminForm}
              onChange={setAdminForm}
              onDelete={onDeleteAdmin}
              onSubmit={saveAdmin}
            />
          ) : (
            <div className="empty-state">Acceso restringido a administradores superiores.</div>
          )
        ) : null}
        {adminScreen === 'talks' ? (
          <TalksAdmin events={events} onAdd={openAddTalk} onEdit={openEditTalk} />
        ) : null}
        {adminScreen === 'talk-add' || adminScreen === 'talk-edit' ? (
          <TalkForm
            editing={adminScreen === 'talk-edit'}
            form={talkForm}
            onChange={setTalkForm}
            onDelete={onDeleteTalk}
            onSubmit={saveTalk}
          />
        ) : null}
        {adminScreen === 'metrics' && isSuperadmin ? <MetricsPanel /> : null}
      </section>
    </div>
  )
}
