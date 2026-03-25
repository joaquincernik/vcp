<script setup>
import CardComponent from "../components/CardComponent.vue"
import { ref, onMounted } from 'vue';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

const URL_BASE = "http://localhost:3000/api";

const formatearNombre = (texto) => {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

// Variables reactivas
const userName = ref('');
const userId = ref();
const userEstado = ref("")
// 1. Creamos una función asíncrona dedicada a buscar el estado
const obtenerEstadoUsuario = async () => {
    try {
        // 2. Corregimos: Usamos userId.value en la URL
        const response = await axios.get(`${URL_BASE}/usuario/${userId.value}`);
      
        userEstado.value = response.data.usuario.Estado.nombre
    } catch (error) {
        console.error('Error al obtener el estado:', error);
    }
};

onMounted(() => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decoded = jwtDecode(token);
      
      userName.value = formatearNombre(decoded.nombre);
      userId.value = decoded.id; // Aquí asignamos el ID correctamente
      

      // 3. Corregimos: Llamamos a la API *después* de tener el ID 
      // y dentro del flujo seguro del onMounted
      if (userId.value) {
          obtenerEstadoUsuario();
      }

    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  } else {
      console.log("No hay token en el localStorage");
  }
});
</script>


<template>
  <div class="bg-[url('/bg-home.jpg')] bg-cover bg-center h-125">
    <h1 style="font-family: Montserrat, sans-serif; font-weight: 700; font-size: 2.5rem;"
      class="pt-25 ml-10 text-white tracking-tight">Hola {{userName}}!</h1>
    <p class="ml-10 text-white/70 font-medium">Que bueno verte devuelta</p>

    <div class="flex gap-4 items-center justify-center mt-10">
      <button class="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">
        Ver proximos eventos
      </button>
      <button class="text-white px-4 py-2  text-sm font-semibold">
        Ir a perfil
      </button>
    </div>
  </div>
<div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8 flex items-center justify-between">
      <div>
        <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
          Estado actual
        </h2>
        
        <div class="flex items-center gap-3 mt-1">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          
          <h3 class="text-2xl font-bold text-gray-800 capitalize" style="font-family: Montserrat, sans-serif;" >
            {{ userEstado || 'Cargando...' }}
          </h3>
        </div>
      </div>

      <div class="hidden sm:flex p-4 bg-blue-50 rounded-2xl text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>

    <div class="mt-12" >
      <h2 class="text-xl font-bold text-gray-800 mb-6 ml-6">Próximos pasos</h2>
      
      <CardComponent />
    </div>



</template>