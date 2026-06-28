import './App.css'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import WelcomePage from './pages/welcome'
import EventsPage from './pages/events'
import { useAppState } from './hooks/useAppState'

function App() {
  const {
    role,
    currentUser,
    loginData,
    loginError,
    adminScreen,
    participantScreen,
    adminForm,
    editingAdmin,
    events,
    participants,
    search,
    talkForm,
    inscriptions,
    confirm,
    toast,
    setLoginData,
    setAdminForm,
    setTalkForm,
    setConfirm,
    handleLogin,
    openAddAdmin,
    openAddTalk,
    onChangeScreen,
    setSearch,
    openEditAdmin,
    openEditTalk,
    saveAdmin,
    saveTalk,
    deleteTalk,
    cancelInscription,
    enrollTalk,
    logout,
    onGoogle,
    registerMode,
    setRegisterMode,
    handleRegister,
  } = useAppState()

  if (role) {
    return (
      <EventsPage
        role={role}
        currentUser={currentUser}
        onLogout={logout}
        adminScreen={adminScreen}
        participantScreen={participantScreen}
        adminForm={adminForm}
        editingAdmin={editingAdmin}
        events={events}
        onAddAdmin={openAddAdmin}
        onAddTalk={openAddTalk}
        onChangeAdminForm={setAdminForm}
        onChangeScreen={onChangeScreen}
        onChangeSearch={setSearch}
        onChangeTalkForm={setTalkForm}
        onDeleteAdmin={() =>
          setConfirm({
            title: '¿Desea eliminar este perfil?',
            action: () => {
              setConfirm(null)
              setConfirm({ title: '', action: null })
            },
          })
        }
        onDeleteTalk={() =>
          setConfirm({
            title: '¿Desea eliminar esta charla?',
            action: deleteTalk,
          })
        }
        onEditAdmin={openEditAdmin}
        onEditTalk={openEditTalk}
        onSaveAdmin={saveAdmin}
        onSaveTalk={saveTalk}
        participants={participants}
        search={search}
        setConfirm={setConfirm}
        talkForm={talkForm}
        inscriptions={inscriptions}
        onCancel={(talk) =>
          setConfirm({
            title: `¿Desea cancelar la inscripcion a ${talk.titulo}?`,
            action: () => cancelInscription(talk),
          })
        }
        onEnroll={(talk) =>
          setConfirm({
            title: `¿Desea inscribirse a ${talk.titulo}?`,
            action: () => enrollTalk(talk),
          })
        }
        confirm={confirm}
        toast={toast}
      />
    )
  }

  if (registerMode === 'login') {
    return (
      <LoginPage
        loginData={loginData}
        loginError={loginError}
        onChange={setLoginData}
        onGoogle={onGoogle}
        onSubmit={handleLogin}
        onBack={() => setRegisterMode('welcome')}
      />
    )
  }

  if (registerMode === 'register') {
    return (
      <RegisterPage
        onBack={() => setRegisterMode('welcome')}
        onSubmit={handleRegister}
        onSuccess={() => setRegisterMode('login')}
        onGoogle={onGoogle}
      />
    )
  }

  return <WelcomePage onLogin={() => setRegisterMode('login')} onRegister={() => setRegisterMode('register')} />
}

export default App
