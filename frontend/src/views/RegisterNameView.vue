<script setup>
import { ref } from 'vue';

// 1. Definimos las variables reactivas
const nombre = ref('');
const apellido = ref('');
const resultado = ref(null);

const buscar = async () => {
    // Validación simple
    if (!nombre.value || !apellido.value) {
        alert("Por favor completa ambos campos");
        return;
    }

    try {
       
        const res = await fetch('http://localhost:3000/api/personas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // 2. Enviamos los datos del v-model
            body: JSON.stringify({
                nombre: nombre.value,
                apellido: apellido.value
            })
        });

        const data = await res.json();
        console.log("Respuesta del servidor:", data);

        // Guardamos la respuesta para usarla en el template si quieres
        //resultado.value = data; 


    } catch (error) {
        console.error("Error en la petición:", error);
        alert("Hubo un error al conectar con el servidor");
    }
}
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-stone-100 px-4">
        <img class="p-6" src="/logo-negro-cropped.png" alt="Logo">

        <form @submit.prevent="buscar" class="w-full max-w-sm rounded-2xl px-6 mt-10 space-y-6">

            <input v-model="nombre" type="text" placeholder="Ingresa tu nombre"
                class="w-full p-4 text-base rounded-xl bg-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <input v-model="apellido" type="text" placeholder="Ingresa tu apellido"
                class="w-full p-4 text-base rounded-xl bg-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <button type="submit"
                class="w-full h-12 rounded-lg bg-blue-600 text-white font-medium active:bg-blue-700 transition">
                Siguiente
            </button>

        </form>

        <div v-if="resultado" class="mt-4 p-4 bg-white rounded shadow text-xs font-mono">
            {{ resultado }}
        </div>
    </div>
</template>