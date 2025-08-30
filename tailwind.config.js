/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {50:"#f5f8ff",100:"#eaf1ff",200:"#d8e5ff",300:"#b6ceff",400:"#86abff",500:"#5b8cff",600:"#3b74ff",700:"#2e5edb",800:"#294fb4",900:"#23438f" }
      },
      spacing: { 'sidebar':'272px' },
      boxShadow: { soft:"0 1px 2px rgba(0,0,0,0.06), 0 8px 24px rgba(35,67,143,0.10)" }
    }
  }, plugins: []
}
