<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 px-5">
    
    <div class="w-full max-w-sm">
      <div class="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl p-7">

        <!-- Logo -->
        <div class="flex justify-center mb-8">
          <img src="/logo-negro-cropped.png" alt="Logo" class="h-12 opacity-90" />
        </div>

        <!-- Título -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-semibold text-slate-900">Bienvenido</h1>
          <p class="text-sm text-slate-500 mt-1">Ingresá con tus datos</p>
        </div>

        <!-- Formulario -->
        <form class="space-y-4" @submit.prevent="onSubmit">

          <!-- DNI -->
           
            <input
              v-model="dni"
              type="text"
              placeholder="DNI"
              class="w-full pl-4 pr-4 py-3.5 rounded-xl bg-slate-100 border border-slate-200
              focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
      

          <!-- Password -->
          
            <input
              v-model="password"
              type="password"
              placeholder="Contraseña"
              class="w-full pl-4 pr-4 py-3.5 rounded-xl bg-slate-100 border border-slate-200
              focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          

          <!-- Botón -->
          <button
            type="submit"
            class="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500
            text-white font-semibold shadow-lg hover:shadow-xl
            active:scale-[0.97] transition-all duration-150"
          >
            Ingresar
          </button>

        </form>

        <!-- Footer -->
        <p class="text-center text-sm text-slate-500 mt-7">
          ¿No tenés una cuenta?
          <a
            href="/registrar/nombre"
            class="text-blue-600 font-semibold hover:underline"
          >
            Registrate
          </a>
        </p>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";

const dni = ref("");
const password = ref("");

function onSubmit() {
  console.log("login", { dni: dni.value, password: password.value });
}
</script>
