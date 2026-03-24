import { DataTypes } from 'sequelize';
import sequelize from '../database.js';  // Importa la conexión

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  dni: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idEstado: {
    type: DataTypes.INTEGER,
    allowNull: true, 
    references: {
      model: 'estados', // IMPORTANTE: Este debe ser el nombre exacto de la tabla de estados en MySQL
      key: 'id',        // La columna de la tabla 'estados' a la que apunta
    },
    onUpdate: 'SET NULL', // Opcional: Qué hacer si el ID del estado cambia
    onDelete: 'SET NULL' // Opcional: Evita borrar un estado si hay usuarios usándolo
  }
}, {
  tableName: 'usuarios',  // Nombre de la tabla en MySQL
  timestamps: true,       // Agrega createdAt y updatedAt automáticamente
});

export default Usuario;