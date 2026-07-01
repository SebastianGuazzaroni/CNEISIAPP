import './App.css'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import WelcomePage from './pages/welcome'
import EventsPage from './pages/events'
import { useApp } from './context/AppContext'

function App() {
  const {
    role,
    loginData,
    loginError,
    setLoginData,
    handleLogin,
    onGoogle,
    registerMode,
    setRegisterMode,
    handleRegister,
  } = useApp()

  if (role) {
    return <EventsPage />
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
