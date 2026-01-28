<script setup>
const buscar = async () => {
  const res = await fetch('http://localhost:3000/api/buscar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre: nombre.value,
      apellido: apellido.value
    })
  })

  const data = await res.json()
  console.log(data)
}

</script>
<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-stone-100 px-4">
        <img class="p-6" src="/logo-negro-cropped.png" alt="">
        <form class="w-full max-w-sm rounded-2xl px-6 mt-10 space-y-6">

            <input type="text" placeholder="Ingresa tu nombre" class="w-full p-4 text-base rounded-xl bg-gray-100 shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500" />

            <input type="text" placeholder="Ingresa tu apellido" class="w-full p-4 text-base rounded-xl bg-gray-100 shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500" />


          
            <button class="w-full h-12  rounded-lg bg-blue-600 text-white font-medium
               active:bg-blue-700 transition">
                Siguiente
            </button>

            
        </form>
    </div>
</template>
