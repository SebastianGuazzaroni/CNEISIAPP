import React from 'react'

export default function Avatar({ participant = false }) {
  return <div className={participant ? 'avatar avatar-dark' : 'avatar'}>{participant ? 'F' : '👩'}</div>
}
