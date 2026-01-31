<<script setup>
import { ref } from 'vue'

const nombre = ref('')
const apellido = ref('')
const dni = ref('')
const telefono = ref('')
const password = ref('')

const loading = ref(false)

const buscar = async () => {
    if (!nombre.value || !apellido.value) {
        alert('Por favor completa ambos campos')
        return
    }

    loading.value = true

    try {
        const res = await fetch('http://localhost:3000/api/personas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: nombre.value,
                apellido: apellido.value,
                dni: dni.value,
                telefono: telefono.value,
                password: password.value
            })
        })

        const dataResponse = await res.json()

        console.log('====================================');
        console.log(res);
        console.log(dataResponse);
        console.log('====================================');

        
    } catch (err) {
        console.error(err)
        alert('Hubo un error al conectar con el servidor')
    } finally {
        loading.value = false
    }
}
</script>

    <template>
        <!-- Flecha volver -->
        <button @click="$router.back()" class="absolute top-25 left-4 w-20 h-20 flex items-center justify-center
             rounded-full bg-white shadow
             active:scale-95 transition" aria-label="Volver">
            <!-- Icono flecha -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <div class="min-h-screen flex flex-col items-center justify-center bg-stone-100 px-4">
            <div class="w-full max-w-sm">
                <div class="flex justify-center">
                    <img class="h-14 mb-6" src="/logo-negro-cropped.png" alt="Logo">
                </div>

                <form @submit.prevent="buscar" class="bg-white rounded-3xl shadow-lg px-6 py-8 space-y-6">
                    <input v-model="nombre" type="text" placeholder="Nombre" class="w-full px-4 py-4 rounded-xl bg-gray-100
             focus:outline-none focus:ring-2 focus:ring-blue-500" />

                    <input v-model="apellido" type="text" placeholder="Apellido" class="w-full px-4 py-4 rounded-xl bg-gray-100
             focus:outline-none focus:ring-2 focus:ring-blue-500" />


                    <input v-model="dni" type="text" placeholder="DNI" class="w-full px-4 py-4 rounded-xl bg-gray-100
             focus:outline-none focus:ring-2 focus:ring-blue-500" />


                    <input v-model="telefono" type="text" placeholder="Telefono" class="w-full px-4 py-4 rounded-xl bg-gray-100
             focus:outline-none focus:ring-2 focus:ring-blue-500" />


                    <input v-model="password" type="password" placeholder="Contrasena" class="w-full px-4 py-4 rounded-xl bg-gray-100
             focus:outline-none focus:ring-2 focus:ring-blue-500" />

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