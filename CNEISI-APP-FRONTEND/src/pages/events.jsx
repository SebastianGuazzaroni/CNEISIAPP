import React from 'react'
import PhoneFrame from '../components/PhoneFrame'
import AppHeader from '../components/Header'
import AdminApp from '../components/AdminApp'
import ParticipantApp from '../components/ParticipantApp'
import UserProfile from './userProfile'
import { useApp } from '../context/AppContext'

export default function EventsPage() {
  const { role, currentUser, confirm, setConfirm, toast } = useApp()
  const isSuperadmin = role === 'superadmin'
  const isAdmin = role === 'admin' || isSuperadmin

  return (
    <PhoneFrame>
      <AppHeader />
      <UserProfile user={currentUser} />
      {isAdmin ? <AdminApp /> : <ParticipantApp />}
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
