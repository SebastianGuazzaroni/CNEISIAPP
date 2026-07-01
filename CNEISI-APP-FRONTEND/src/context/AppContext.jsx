import { createContext, useContext } from 'react'
import { useAppState } from '../hooks/useAppState'

const AppContext = createContext(null)

/**
 * Provee el estado global de la aplicación (sesión, eventos, inscripciones,
 * navegación entre pantallas, etc.) a todo el árbol de componentes mediante
 * la Context API de React, evitando pasar decenas de props manualmente.
 */
export function AppProvider({ children }) {
  const state = useAppState()
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>
}

/**
 * Hook de acceso al estado global. Debe usarse dentro de un <AppProvider>.
 */
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp debe usarse dentro de un <AppProvider>')
  }
  return context
}
