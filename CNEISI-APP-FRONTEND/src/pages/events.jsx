import React from 'react'
import PhoneFrame from '../components/PhoneFrame'
import AppHeader from '../components/Header'
import AdminApp from '../components/AdminApp'
import ParticipantApp from '../components/ParticipantApp'
import UserProfile from './userProfile'

export default function EventsPage({
  role,
  currentUser,
  onLogout,
  adminScreen,
  participantScreen,
  adminForm,
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
  setConfirm,
  talkForm,
  inscriptions,
  onCancel,
  onEnroll,
  confirm,
  toast,
}) {
  const isSuperadmin = role === 'superadmin'
  const isAdmin = role === 'admin' || isSuperadmin

  return (
    <PhoneFrame>
      <AppHeader
        profile={{
          name: currentUser?.nombreApellido || 'Nombre',
          role: isSuperadmin ? 'Superadministrador' : isAdmin ? 'Administrador' : 'Participante',
          participant: !isAdmin,
        }}
        onLogout={onLogout}
      />
      <UserProfile user={currentUser} />
      {isAdmin ? (
        <AdminApp
          isSuperadmin={isSuperadmin}
          adminForm={adminForm}
          adminScreen={adminScreen}
          editingAdmin={editingAdmin}
          events={events}
          onAddAdmin={onAddAdmin}
          onAddTalk={onAddTalk}
          onChangeAdminForm={onChangeAdminForm}
          onChangeScreen={onChangeScreen}
          onChangeSearch={onChangeSearch}
          onChangeTalkForm={onChangeTalkForm}
          onDeleteAdmin={onDeleteAdmin}
          onDeleteTalk={onDeleteTalk}
          onEditAdmin={onEditAdmin}
          onEditTalk={onEditTalk}
          onSaveAdmin={onSaveAdmin}
          onSaveTalk={onSaveTalk}
          participants={participants}
          search={search}
          setConfirm={setConfirm}
          talkForm={talkForm}
        />
      ) : (
        <ParticipantApp
          events={events}
          inscriptions={inscriptions}
          onCancel={onCancel}
          onChangeScreen={onChangeScreen}
          onEnroll={onEnroll}
          screen={participantScreen}
        />
      )}
      {confirm ? (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>{confirm.title}</p>
            <div className="confirm-actions">
              <button className="danger-button" type="button" onClick={async () => {
                await confirm.action()
                setConfirm(null)
              }}>
                Sí
              </button>
              <button type="button" onClick={() => setConfirm(null)}>
                No
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {toast ? <div className="toast-container"><div className="toast">{toast}</div></div> : null}
    </PhoneFrame>
  )
}
