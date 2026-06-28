import React from 'react'

export default function SideNav({ active, items, onChange }) {
  return (
    <nav className="side-nav" aria-label="Secciones">
      {items.map((item) => (
        <button
          className={active.startsWith(item.id.split('-')[0]) || active === item.id ? 'active' : ''}
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
        >
          <span>•••</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}
