/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',    // Todos los archivos HTML en el directorio raíz
    './js/*.js',   // Todos los archivos JavaScript en la carpeta 'js'
    './js/groupsJS/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

