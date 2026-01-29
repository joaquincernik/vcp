<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-stone-100 px-4">
    <div class="w-full max-w-sm">

      <!-- Logo -->
      <div class="flex justify-center">
        <img src="/logo-negro-cropped.png" alt="Logo" class="h-14 mb-12" />
      </div>

      <!-- Título -->
      <div class="text-center space-y-1">
        <h1 class="text-2xl font-semibold text-gray-900">Bienvenido</h1>
        <p class="text-sm text-gray-500">Ingresá con tus datos</p>
      </div>

      <!-- Formulario -->
      <form class="bg-white rounded-3xl shadow-lg px-6 py-8 space-y-6">
        <div>
          <input
            type="text"
            placeholder="DNI"
            class="w-full px-4 py-4 rounded-xl bg-gray-100
             focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>

        <div>
          <input
            type="password"
            placeholder="Contraseña"
           class="w-full px-4 py-4 rounded-xl bg-gray-100
             focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button
          class="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold
                 hover:bg-blue-700 active:scale-[0.98]
                 transition-all duration-150 shadow-md"
        >
          Ingresar
        </button>
      </form>

      <!-- Footer -->
      <p class="text-center text-xs text-gray-500 mt-5">
        ¿No tenés una cuenta?
        <a
          href="/registrar/nombre"
          class="text-blue-600 font-medium hover:underline"
        >
          Registrate
        </a>
      </p>

    </div>
  </div>
</template>

