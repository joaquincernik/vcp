import express from 'express'
import cors from 'cors'
import routes from './routes.js'
import sequelize from './database.js';  // Nueva importación



const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', routes)


// Sincronizar modelos con la base de datos
sequelize.sync({alter:true})  // Cambia a true solo para desarrollo (borra y recrea tablas)
  .then(() => {
    console.log('Modelos sincronizados con la base de datos.');
  })
  .catch((error) => {
    console.error('Error al sincronizar modelos:', error);
  });

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`)
})
