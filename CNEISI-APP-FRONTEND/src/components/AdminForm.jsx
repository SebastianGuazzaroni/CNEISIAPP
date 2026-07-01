import React from 'react'
import SectionTitle from './SectionTitle'

export default function AdminForm({ editing, form, onChange, onDelete, onSubmit }) {
  return (
    <form className="form-view" onSubmit={onSubmit}>
      <SectionTitle>{editing ? 'EDITAR PERFIL ADMINISTRADOR' : 'AÑADIR PERFIL ADMINISTRADOR'}</SectionTitle>
      <input
        placeholder="Nombre"
        value={form.nombreApellido}
        onChange={(event) => onChange({ ...form, nombreApellido: event.target.value })}
      />
      <input placeholder="Email" value={form.email} onChange={(event) => onChange({ ...form, email: event.target.value })} />
      <input
        placeholder="Legajo"
        value={form.legajo}
        onChange={(event) => onChange({ ...form, legajo: event.target.value })}
      />
      <button className="primary-button wide-save" type="submit">
        Guardar cambios
      </button>
      {editing ? (
        <button className="danger-button" type="button" onClick={onDelete}>
          Eliminar
        </button>
      ) : null}
    </form>
  )
}
