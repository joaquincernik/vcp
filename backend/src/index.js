import express from 'express'
import cors from 'cors'
import path from 'path' // NATIVO DE NODE: Para manejar rutas de carpetas
import { fileURLToPath } from 'url' // NATIVO DE NODE: Necesario para ES Modules
import routes from './routes.js'
import sequelize from './database/database.js';
import './models/associations.js'


const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', routes)

// ----------------------- deploy - ---------------------------
// Servir los archivos estáticos del frontend (Vue)
// Asumimos que pondrás los archivos compilados de Vue en una carpeta llamada "dist"
app.use(express.static(path.join(__dirname, 'dist')))
// 3. Manejo de Vue Router (Modo History)
// Cualquier petición que no sea a la API, devolverá el index.html de Vue
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})
const PORT = process.env.PORT || 3000


//----------------------------------------------------
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexion a MySQL exitosa.');

    //await sequelize.sync({ alter: true });
    await sequelize.sync();
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
