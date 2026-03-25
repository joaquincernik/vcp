import Usuario from './Usuario.js';
import Estado from './Estado.js';

Usuario.belongsTo(Estado, {
  foreignKey: 'idEstado',
  as: 'Estado',
});

Estado.hasMany(Usuario, {
  foreignKey: 'idEstado',
  as: 'usuarios',
});

export { Usuario, Estado };
