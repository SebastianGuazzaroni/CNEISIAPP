import SectionTitle from './SectionTitle'

export default function TalkForm({ editing, form, onChange, onDelete, onSubmit }) {
  return (
    <form className="glass-card p-4 d-flex flex-column gap-3" onSubmit={onSubmit}>
      <SectionTitle>{editing ? 'EDITAR ACTIVIDAD' : 'AÑADIR ACTIVIDAD'}</SectionTitle>
      <input className="form-control" placeholder="Título" value={form.titulo} onChange={(event) => onChange({ ...form, titulo: event.target.value })} />
      <input
        className="form-control"
        placeholder="Disertante"
        value={form.orador}
        onChange={(event) => onChange({ ...form, orador: event.target.value })}
      />
      <input className="form-control" placeholder="Fecha" type="date" value={form.fecha} onChange={(event) => onChange({ ...form, fecha: event.target.value })} />
      <div className="row g-3">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Hora inicio"
            type="time"
            value={form.horaInicio}
            onChange={(event) => onChange({ ...form, horaInicio: event.target.value })}
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Hora fin"
            type="time"
            value={form.horaFin}
            onChange={(event) => onChange({ ...form, horaFin: event.target.value })}
          />
        </div>
      </div>
      <select className="form-select" value={form.tipo} onChange={(event) => onChange({ ...form, tipo: event.target.value })}>
        <option value="CHARLA">Charla</option>
        <option value="TALLER">Taller</option>
        <option value="GENERAL">General</option>
      </select>
      <select className="form-select" value={form.sala} onChange={(event) => onChange({ ...form, sala: event.target.value })}>
        <option value="">Aula</option>
        <option value="114">114</option>
        <option value="117">117</option>
        <option value="118">118</option>
        <option value="B">B</option>
      </select>
      <input
        className="form-control"
        placeholder="Cupo máximo"
        type="number"
        min="1"
        value={form.cupoMaximo}
        onChange={(event) => onChange({ ...form, cupoMaximo: event.target.value })}
      />
      <button className="btn btn-cneisi w-100" type="submit">
        Guardar cambios
      </button>
      {editing ? (
        <button className="btn btn-danger w-100" type="button" onClick={onDelete}>
          Eliminar
        </button>
      ) : null}
    </form>
  )
}
