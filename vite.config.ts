import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS({
      shortcuts: {
        btn: "py-4 px-4 font-semibold rounded-lg shadow-md transition-colors",
        "btn-primary": "bg-safari-primary text-safari-dark hover:bg-safari-primary-dark",
        "input-primary":
          "w-full p-4 border-2 rounded-lg outline-none transition-colors bg-safari-light border-safari-accent focus:border-safari-primary",
        card: "bg-safari-light border-2 border-safari-accent rounded-xl shadow-lg",
      },
      theme: {
        colors: {
          safari: {
            // Main background gradient colors
            light: "#FEFCE8",
            accent: "#FFF5E1",

            // Primary action colors
            primary: "#FFB996",
            "primary-dark": "#FF9B7D",

            // Secondary colors
            secondary: "#B4E4FF",
            tertiary: "#95CDBA",

            // Text colors
            dark: "#725A3B",
            "dark-soft": "#8B7355",

            // Status colors
            success: "#A8D5BA",
            error: "#FFB5B5",
            warning: "#FFE2B3",
            info: "#B4D5FF",
          },
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
