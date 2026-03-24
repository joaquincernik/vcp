import { DataTypes } from 'sequelize';
import sequelize from '../database.js';  // Importa la conexión

const Estado = sequelize.define('Estado', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'estados',  
  timestamps: false
});

export default Estado;