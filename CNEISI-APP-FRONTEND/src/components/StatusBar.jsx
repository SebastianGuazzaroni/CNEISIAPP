import React, { useEffect, useState } from 'react'

export default function StatusBar() {
  const [currentTime, setCurrentTime] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(formatTime(new Date()))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="status-bar" aria-hidden="true">
      <strong>{currentTime}</strong>
      <span>▮▮▮ ⌁ ▰</span>
    </div>
  )
}

function formatTime(date) {
  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}
