<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-stone-100 px-4">
    <img src="/logo-negro.png" alt="">
    <form class="w-full max-w-sm rounded-2xl px-6 space-y-4">

      <input
        type="text"
        placeholder="DNI"
        class="w-full p-4 text-base rounded-xl bg-gray-100 shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        placeholder="Contraseña"
      class="w-full p-4 text-base rounded-xl bg-gray-100 shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500"
       />

      <button
        class="w-full h-12 rounded-lg bg-blue-600 text-white font-medium
               active:bg-blue-700 transition"
      >
        Ingresar
      </button>

      <p class="text-center text-gray-400 text-xs">
        ¿No tienes una cuenta? <a class="text-blue-600">Registrate</a>
</p>
    </form>
  </div>
</template>
