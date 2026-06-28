import React from 'react'
import StatusBar from './StatusBar'

export default function PhoneFrame({ children }) {
  return (
    <main className="phone-frame">
      <StatusBar />
      {children}
    </main>
  )
}
