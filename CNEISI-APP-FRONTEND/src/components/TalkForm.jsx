import SectionTitle from './SectionTitle'

export default function TalkForm({ editing, form, onChange, onDelete, onSubmit }) {
  return (
    <form className="form-view talk-form" onSubmit={onSubmit}>
      <SectionTitle>{editing ? 'EDITAR CHARLA' : 'AÑADIR CHARLA'}</SectionTitle>
      <input placeholder="Título" value={form.titulo} onChange={(event) => onChange({ ...form, titulo: event.target.value })} />
      <input
        placeholder="Disertante"
        value={form.orador}
        onChange={(event) => onChange({ ...form, orador: event.target.value })}
      />
      <input placeholder="Fecha" type="date" value={form.fecha} onChange={(event) => onChange({ ...form, fecha: event.target.value })} />
      <input
        placeholder="Hora inicio"
        type="time"
        value={form.horaInicio}
        onChange={(event) => onChange({ ...form, horaInicio: event.target.value })}
      />
      <input
        placeholder="Hora fin"
        type="time"
        value={form.horaFin}
        onChange={(event) => onChange({ ...form, horaFin: event.target.value })}
      />
      <select value={form.sala} onChange={(event) => onChange({ ...form, sala: event.target.value })}>
        <option value="">Aula</option>
        <option value="114">114</option>
        <option value="117">117</option>
        <option value="118">118</option>
        <option value="B">B</option>
      </select>
      <input
        placeholder="Cupo máximo"
        type="number"
        min="1"
        value={form.cupoMaximo}
        onChange={(event) => onChange({ ...form, cupoMaximo: event.target.value })}
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
