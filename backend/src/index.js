import express from 'express'
import cors from 'cors'
import routes from './routes.js'
import sequelize from './database/database.js';
import './models/associations.js'


const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', routes)

const PORT = 3000

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexion a MySQL exitosa.');

    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados con la base de datos.');

    app.listen(PORT, () => {
      console.log(`Backend corriendo en http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Error iniciando Sequelize:', error);
    process.exit(1);
  }
}

startServer()
