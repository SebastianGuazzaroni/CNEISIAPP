const { sequelize, Usuario, Evento, Inscripcion, Whitelist, Asistencia, Feedback } = require('./models');

const SEED_USERS = [
  {
    nombreApellido: 'Super Admin CNEISI',
    email: 'superadmin@cneisi.test',
    password: 'superadmin123',
    rol: 'superadmin',
  },
  {
    nombreApellido: 'Admin Voluntario',
    email: 'admin@cneisi.test',
    password: 'admin123',
    rol: 'admin',
  },
  {
    nombreApellido: 'Participante Demo',
    email: 'participante@cneisi.test',
    password: 'participante123',
    rol: 'participant',
  },
];

const SEED_WHITELIST = [
  { email: 'participante@cneisi.test', nombreApellido: 'Participante Demo' },
  { email: 'alumno1@cneisi.test', nombreApellido: 'Ana García' },
  { email: 'alumno2@cneisi.test', nombreApellido: 'Lucas Pérez' },
];

const SEED_EVENTS = [
  {
    titulo: 'Apertura del Congreso',
    descripcion: 'Acto inaugural del CNEISI 2026',
    orador: 'Comité Organizador',
    sala: 'Auditorio Principal',
    tipo: 'GENERAL',
    fecha: new Date('2026-07-15T09:00:00'),
    fechaFin: new Date('2026-07-15T10:30:00'),
    cupoMaximo: 200,
    cupoDisponible: 200,
  },
  {
    titulo: 'Inteligencia Artificial en la Industria',
    descripcion: 'Charla sobre aplicaciones de IA',
    orador: 'Dr. Martín López',
    sala: 'Aula 114',
    tipo: 'CHARLA',
    fecha: new Date('2026-07-15T11:00:00'),
    fechaFin: new Date('2026-07-15T12:30:00'),
    cupoMaximo: 70,
    cupoDisponible: 68,
  },
  {
    titulo: 'Taller de React Avanzado',
    descripcion: 'Hands-on con hooks y patrones modernos',
    orador: 'Ing. Carla Ruiz',
    sala: 'Lab 3',
    tipo: 'TALLER',
    fecha: new Date('2026-07-15T15:00:00'),
    fechaFin: new Date('2026-07-15T17:00:00'),
    cupoMaximo: 40,
    cupoDisponible: 39,
  },
  {
    titulo: 'Ciberseguridad para Developers',
    descripcion: 'Buenas prácticas de seguridad en aplicaciones web',
    orador: 'Lic. Diego Fernández',
    sala: 'Aula 201',
    tipo: 'CHARLA',
    fecha: new Date('2026-07-15T10:00:00'),
    fechaFin: new Date('2026-07-15T11:30:00'),
    cupoMaximo: 60,
    cupoDisponible: 60,
  },
];

async function seed() {
  await sequelize.sync({ force: true });

  await Whitelist.bulkCreate(SEED_WHITELIST);
  await Usuario.bulkCreate(SEED_USERS);
  await Evento.bulkCreate(SEED_EVENTS);

  const participant = await Usuario.findOne({ where: { email: 'participante@cneisi.test' } });
  const event = await Evento.findOne({ where: { titulo: 'Inteligencia Artificial en la Industria' } });
  const pastEvent = await Evento.findOne({ where: { titulo: 'Ciberseguridad para Developers' } });

  if (participant && event) {
    const inscripcion = await Inscripcion.create({
      usuarioId: participant.id,
      eventoId: event.id,
      fechaInscripcion: new Date(),
      estado: 'confirmada',
    });

    await Asistencia.create({
      usuarioId: participant.id,
      eventoId: event.id,
      fechaRegistro: new Date('2026-07-15T11:05:00'),
      inscrito: true,
      metodo: 'manual',
    });
  }

  if (participant && pastEvent) {
    const pastInscripcion = await Inscripcion.create({
      usuarioId: participant.id,
      eventoId: pastEvent.id,
      fechaInscripcion: new Date('2026-07-15T09:30:00'),
      estado: 'confirmada',
    });

    await pastEvent.update({ cupoDisponible: pastEvent.cupoDisponible - 1 });

    await Asistencia.create({
      usuarioId: participant.id,
      eventoId: pastEvent.id,
      fechaRegistro: new Date('2026-07-15T10:05:00'),
      inscrito: true,
      metodo: 'manual',
    });

    await Feedback.create({
      eventoId: pastEvent.id,
      usuarioId: participant.id,
      inscripcionId: pastInscripcion.id,
      respuesta1: 5,
      respuesta2: 4,
      respuesta3: 5,
      respuesta4: 4,
      respuesta5: 5,
      fechaCreacion: new Date('2026-07-15T11:50:00'),
    });
  }

  console.log('Seed completado.');
  console.log('Usuarios de prueba:');
  SEED_USERS.forEach((user) => {
    console.log(`  ${user.rol}: ${user.email} / ${user.password}`);
  });
}

if (require.main === module) {
  seed()
    .catch((error) => {
      console.error('Error en seed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await sequelize.close();
    });
}

module.exports = { seed };
