import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const projectId = env.VITE_PROJECT_ID || 'ai_safety';
  
  const projectTitles = {
    ai_safety: 'AI Safety Notes',
    animal_welfare: 'Animal Welfare Notes'
  };

  return {
    plugins: [react()],
    define: {
      'process.env': {},
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Replace the title placeholder with the correct project title
    replacements: {
      '%VITE_PROJECT_TITLE%': projectTitles[projectId as keyof typeof projectTitles],
    },
  };
});
