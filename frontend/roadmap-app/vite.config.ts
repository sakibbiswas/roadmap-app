import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/", // ✅ must be "/" for Vercel
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
  },
  
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   build: {
//     outDir: "dist", // ✅ this is correct
//   },
//   base: "/", // ✅ this is also correct for Vercel
// });







