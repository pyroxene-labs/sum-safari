import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS({
      shortcuts: {
        // 'btn': 'py-2 px-4 font-semibold rounded-lg shadow-md',
        // 'btn-primary': 'bg-green-500 text-white hover:bg-green-700',
        // 'input-primary': 'w-full p-4 border-2 rounded-lg outline-none transition-colors'
        btn: "py-2 px-4 font-semibold rounded-lg shadow-md transition-colors",
        "btn-primary":
          "bg-safari-primary text-safari-dark hover:bg-safari-primary-dark",
        "input-primary":
          "w-full p-4 border-2 rounded-lg outline-none transition-colors bg-safari-light border-safari-accent focus:border-safari-primary",
        card: "bg-safari-light border-2 border-safari-accent rounded-xl shadow-md",
      },
      theme: {
        colors: {
          // safari: {
          //   primary: "#f97316", // orange-500
          //   secondary: "#facc15", // yellow-400
          //   accent: "#65a30d", // lime-600
          // },
          safari: {
            // Main background gradient colors
            light: "#FFF5E1", // Soft cream
            accent: "#FFE4BC", // Gentle peach

            // Primary action colors
            primary: "#FFB996", // Soft coral
            "primary-dark": "#FF9B7D", // Darker coral for hover

            // Secondary colors
            secondary: "#B4E4FF", // Soft sky blue
            tertiary: "#95CDBA", // Sage green

            // Text colors
            dark: "#725A3B", // Warm brown
            "dark-soft": "#8B7355", // Lighter brown for secondary text

            // Status colors
            success: "#A8D5BA", // Soft green
            error: "#FFB5B5", // Soft red
            warning: "#FFE2B3", // Soft orange
            info: "#B4D5FF", // Soft blue
          },
        },
      },
    }),
  ],
});
