const { sequelize, Usuario, Whitelist } = require('./models');

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

async function seed() {
  await sequelize.sync({ force: true });

  await Whitelist.bulkCreate(SEED_WHITELIST);
  await Usuario.bulkCreate(SEED_USERS);

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
