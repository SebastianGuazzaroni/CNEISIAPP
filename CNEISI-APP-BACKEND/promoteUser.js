(async function(){
  try{
    const { Usuario, sequelize } = require('./models');
    await sequelize.authenticate();
    await Usuario.update({ rol: 'admin' }, { where: { email: 'mateosuardi20@gmail.com' } });
    const u = await Usuario.findOne({ where: { email: 'mateosuardi20@gmail.com' } });
    console.log('UPDATED_USER:' + JSON.stringify(u ? u.toJSON() : null));
    await sequelize.close();
  }catch(e){
    console.error('ERR', e);
    process.exit(1);
  }
})();
