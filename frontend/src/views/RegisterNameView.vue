<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
const router = useRouter()
const nombre = ref('')
const apellido = ref('')
const dni = ref('')
const telefono = ref('')
const password = ref('')
const errorUsuarioEncontrado = ref(false)
const loading = ref(false)

const buscar = async () => {
    /* if (!nombre.value || !apellido.value) {
         alert('Por favor completa ambos campos')
         return
     } */
     
    loading.value = true;
    errorUsuarioEncontrado.value = false; // Es buena práctica resetear este valor al iniciar

    try {
        const res = await axios.post('http://localhost:3000/api/register', {
            nombre: nombre.value.toLowerCase(),
            apellido: apellido.value.toLowerCase(),
            dni: dni.value,
            telefono: telefono.value,
            password: password.value
        });

        // 1. SI LLEGAMOS AQUÍ: La petición fue un éxito (Status 2xx).
        // Axios ya validó que todo salió bien, no necesitamos "res.ok"
        console.log('Usuario creado exitosamente:', res.data);
        
        localStorage.setItem("token", res.data.token);
        router.push(`/home`); 

    } catch (err) {
        // 2. SI LLEGAMOS AQUÍ: Hubo un error de red o el servidor devolvió un error (4xx, 5xx)
        console.error('Detalle del error:', err);

        // Axios guarda la respuesta del servidor en `err.response`
        if (err.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            console.log('Código de estado:', err.response.status);
            
            // Reemplaza el 409 por el código exacto que esté enviando tu backend para "usuario duplicado"
            // (Si de verdad estás forzando un 302, pon 302, aunque te recomiendo cambiar el backend a 409)
            if (err.response.status === 409 ) {
                errorUsuarioEncontrado.value = true;
            } else {
                alert('Error al crear usuario. Verifica los datos.');
            }
        } 
        else if (err.request) {
            // La petición se hizo pero no hubo respuesta del servidor (ej. servidor apagado)
            alert('No se pudo conectar con el servidor. Revisa tu conexión.');
        } 
        else {
            // Ocurrió un error al configurar la petición antes de enviarla
            alert('Hubo un problema al procesar la solicitud.');
        }
    } finally {
        // 3. SIEMPRE se ejecuta al final, haya éxito o error
        loading.value = false;
    }
};
</script>
<template>
    <!-- Flecha volver -->
    <!-- <button @click="$router.back()" class="absolute top-25 left-4 w-20 h-20 flex items-center justify-center
             rounded-full bg-white shadow
             active:scale-95 transition" aria-label="Volver"> -->
    <!-- Icono flecha -->
    <!-- <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
    </button> -->

    <div class="min-h-screen flex flex-col items-center justify-center bg-stone-100 px-4">
        <div class="w-full max-w-sm">
            <div class="flex justify-center">
                <img class="h-14 mb-6" src="/logo-negro-cropped.png" alt="Logo">
            </div>

            <form @submit.prevent="buscar" class="bg-white rounded-3xl shadow-lg px-6 py-8 space-y-6">
                <input v-model="nombre" required type="text" placeholder="Nombre" class="w-full px-4 py-4 rounded-xl bg-gray-100
             focus:outline-none focus:ring-2 focus:ring-blue-500" />

                <input v-model="apellido" required type="text" placeholder="Apellido" class="w-full px-4 py-4 rounded-xl bg-gray-100
             focus:outline-none focus:ring-2 focus:ring-blue-500" />


                <input v-model="dni" type="text" required placeholder="DNI" class="w-full px-4 py-4 rounded-xl bg-gray-100
             focus:outline-none focus:ring-2 focus:ring-blue-500" />


                <input v-model="telefono" type="text" required placeholder="Telefono" class="w-full px-4 py-4 rounded-xl bg-gray-100
             focus:outline-none focus:ring-2 focus:ring-blue-500" />


                <input v-model="password" minlength="8" type="password" required placeholder="Contrasena" class="w-full px-4 py-4 rounded-xl bg-gray-100
             focus:outline-none focus:ring-2 focus:ring-blue-500" />


                <div v-if="errorUsuarioEncontrado" class="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 
  text-sm px-4 py-3 rounded-xl">
                    <!-- Icono -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 9v2m0 4h.01M12 3a9 9 0 110 18 9 9 0 010-18z" />
                    </svg>

                    <span>Ya existe un usuario con ese DNI, <a href="/login">inicia sesion</a></span>
                </div>


                <button type="submit" :disabled="loading" class="w-full h-14 rounded-xl bg-blue-600 text-white font-semibold
             flex items-center justify-center gap-2
             active:scale-[0.98]
             disabled:opacity-50 transition">
                    <span v-if="!loading">Siguiente</span>
                    <span v-else class="flex items-center gap-2">
                        Buscando
                        <img src="/loading.svg" class="w-5 h-5 animate-spin" />
                    </span>
                </button>
            </form>
        </div>


    </div>
</template>