import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
const sequelize = new Sequelize(
  process.env.DB_NAME || 'vcp',  // Nombre de la base de datos
  process.env.DB_USER,             // Usuario de MySQL
  process.env.DB_PASSWORD,             // Contraseña
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,  // Desactiva logs de SQL en consola (opcional)
  }
);

// Verificar conexión
try {
  await sequelize.authenticate();
  console.log('Conexión a MySQL exitosa.');
} catch (error) {
  console.error('Error al conectar a MySQL:', error);
}

export default sequelize;