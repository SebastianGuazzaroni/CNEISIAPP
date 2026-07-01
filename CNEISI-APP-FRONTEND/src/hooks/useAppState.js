import { useEffect, useMemo, useState } from 'react'
import { fetchJson } from '../services/api'
import { normalizeRole } from '../utils/roleUtils'
import {
  emptyAdminForm,
  emptyTalkForm,
  normalizeEvent,
  buildEventPayload,
  toDateInput,
  addMinutes,
} from '../utils/eventUtils'

export function useAppState() {
  const [role, setRole] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState(false)
  const [adminScreen, setAdminScreen] = useState('talks')
  const [participantScreen, setParticipantScreen] = useState('schedule')
  const [events, setEvents] = useState([])
  const [users, setUsers] = useState([])
  const [inscriptions, setInscriptions] = useState([])
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')
  const [adminForm, setAdminForm] = useState(emptyAdminForm)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [talkForm, setTalkForm] = useState(emptyTalkForm)
  const [editingTalk, setEditingTalk] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [registerMode, setRegisterMode] = useState('welcome')

  useEffect(() => {
    loadBackendData()
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const participants = useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        nombreApellido: user.nombreApellido,
        email: user.email,
      })),
    [users],
  )

  const visibleEvents = useMemo(() => events.map(normalizeEvent), [events])

  const myInscriptions = useMemo(() => {
    const byId = new Map(visibleEvents.map((event) => [String(event.id), event]))
    const fromBackend = inscriptions
      .map((inscription) => inscription.evento || byId.get(String(inscription.eventoId)))
      .filter(Boolean)
      .map(normalizeEvent)

    const unique = new Map()
    fromBackend.forEach((event) => unique.set(String(event.id), event))
    return Array.from(unique.values())
  }, [inscriptions, visibleEvents])

  async function loadBackendData() {
    try {
      const [eventosData, usuariosData, inscripcionesData] = await Promise.all([
        fetchJson('/Eventos'),
        fetchJson('/Usuarios'),
        fetchJson('/Inscripciones'),
      ])

      if (Array.isArray(eventosData) && eventosData.length) {
        setEvents(eventosData)
      }

      if (Array.isArray(usuariosData)) {
        setUsers(usuariosData)
      }

      if (Array.isArray(inscripcionesData)) {
        setInscriptions(inscripcionesData)
      }
    } catch {
      setToast('Backend sin respuesta')
    }
  }

  async function handleLogin(event) {
    event.preventDefault()

    const email = loginData.email.trim().toLowerCase()
    const password = loginData.password

    if (!email || !password) {
      setLoginError(true)
    
      return
    }

    try {
      const user = await fetchJson('/Authentications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      setLoginError(false)
      const normalizedRole = normalizeRole(user.rol)
      setCurrentUser({ ...user, rol: normalizedRole })
      setUsers((current) => {
        const exists = current.find((u) => u.id === user.id)
        if (exists) return current
        return [...current, { ...user, rol: normalizedRole }]
      })
      setRole(normalizedRole)
      setAdminScreen('talks')
    } catch {
      setLoginError(true)
      setToast('Credenciales inválidas')
    }
  }

  function openAddAdmin() {
    setAdminForm(emptyAdminForm)
    setEditingAdmin(null)
    setAdminScreen('admin-add')
  }

  function openEditAdmin(admin) {
    setAdminForm(admin)
    setEditingAdmin(admin)
    setAdminScreen('admin-edit')
  }

  function saveAdmin(event) {
    event.preventDefault()
    setToast(editingAdmin ? 'Perfil actualizado' : 'Perfil guardado')
    setAdminScreen('admins')
  }

  function openAddTalk() {
    setTalkForm(emptyTalkForm)
    setEditingTalk(null)
    setAdminScreen('talk-add')
  }

  function handleAdminScreenChange(screen) {
    if (role === 'superadmin') {
      setAdminScreen(screen)
      return
    }

    if (role === 'admin') {
      const allowed = ['talks', 'talk-add', 'talk-edit']
      setAdminScreen(allowed.includes(screen) ? screen : 'talks')
      return
    }

    setAdminScreen('talks')
  }

  function openEditTalk(talk) {
    setEditingTalk(talk)
    setTalkForm({
      titulo: talk.titulo,
      descripcion: talk.descripcion,
      orador: talk.orador,
      fecha: toDateInput(talk.fecha),
      horaInicio: talk.horaInicio,
      horaFin: talk.horaFin,
      sala: talk.sala,
      cupoMaximo: talk.cupoMaximo,
    })
    setAdminScreen('talk-edit')
  }

  async function saveTalk(event) {
    event.preventDefault()
    const payload = buildEventPayload(talkForm)

    if (editingTalk) {
      try {
        const updated = await fetchJson(`/Eventos/${editingTalk.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        setEvents((current) =>
          current.map((talk) =>
            String(talk.id) === String(editingTalk.id)
              ? { ...talk, ...updated, horaFin: talkForm.horaFin || updated.horaFin }
              : talk,
          ),
        )
        setToast('Charla actualizada')
        setAdminScreen('talks')
      } catch {
        setToast('No se pudo actualizar la charla')
      }
      return
    }

    try {
      const created = await fetchJson('/Eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      setEvents((current) => [
        ...current,
        { ...created, horaFin: talkForm.horaFin || addMinutes(payload.fecha, 90) },
      ])
      setToast('Charla guardada')
      setAdminScreen('talks')
    } catch {
      setToast('No se pudo guardar la charla')
    }
  }

  async function deleteTalk() {
    if (!editingTalk) return

    const id = String(editingTalk.id)
    setConfirm(null)

    try {
      await fetchJson(`/Eventos/${id}`, { method: 'DELETE' })
      setEvents((current) => current.filter((talk) => String(talk.id) !== id))
      setAdminScreen('talks')
      setToast('Charla eliminada')
    } catch {
      setToast('No se pudo eliminar la charla')
    }
  }

  async function enrollTalk(talk) {
    const normalizedTalk = normalizeEvent(talk)
    setConfirm(null)

    if (normalizedTalk.demo) {
      setInscriptions((current) => [
        ...current,
        { id: `local-inscription-${normalizedTalk.id}`, eventoId: normalizedTalk.id, evento: normalizedTalk },
      ])
      setToast('Inscripcion confirmada')
      return
    }

    try {
      const userId = currentUser?.id || users[0]?.id || 1
      const created = await fetchJson('/Inscripciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventoId: normalizedTalk.id, usuarioId: userId }),
      })

      setInscriptions((current) => [...current, { ...created, evento: normalizedTalk }])
      setToast('Inscripcion confirmada')
    } catch {
      setToast('No se pudo inscribir')
    }
  }

  function cancelInscription(talk) {
    const normalizedTalk = normalizeEvent(talk)
    setConfirm(null)
    setInscriptions((current) =>
      current.filter((inscription) => String(inscription.eventoId) !== String(normalizedTalk.id)),
    )
    setToast('Inscripcion cancelada')
  }

  function logout() {
    setRole(null)
    setCurrentUser(null)
    setAdminScreen('talks')
    setParticipantScreen('schedule')
  }

  function onGoogle() {
    setRole('participant')
    setCurrentUser(null)
  }

  async function handleRegister(form) {
    try {
      await fetchJson('/Usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreApellido: form.nombreApellido,
          email: form.email.trim().toLowerCase(),
          password: form.password,
          rol: 'participant',
        }),
      })

      setToast('Usuario registrado. Inicia sesión para continuar.')
      setRegisterMode('login')
      return { success: true }
    } catch (error) {
      const message = error?.message || 'No se pudo registrar usuario'
      setToast(message)
      return { success: false, message }
    }
  }

  const onChangeScreen = role === 'participant' ? setParticipantScreen : handleAdminScreenChange

  return {
    role,
    currentUser,
    loginData,
    loginError,
    adminScreen,
    participantScreen,
    adminForm,
    editingAdmin,
    events: visibleEvents,
    participants,
    search,
    talkForm,
    inscriptions: myInscriptions,
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
  }
}
