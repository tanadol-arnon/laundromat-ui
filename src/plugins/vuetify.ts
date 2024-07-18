/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { ThemeDefinition, createVuetify } from "vuetify";

const luandromatTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: "#f1f5f9",
    surface: "#ffffff",
    "surface-bright": "#ffffff",
    "surface-light": "#f1f5f9",
    "surface-variant": "#424242",
    "on-surface-variant": "#f1f5f9",
    primary: "#007aff",
    "primary-darken-1": "#0c71df",
    secondary: "#334155",
    "secondary-darken-1": "#1e293b",
    error: "#dc3545",
    info: "#2196F3",
    success: "#10b981",
    warning: "#ffc107",
  },
};
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "luandromatTheme",
    themes: {
      luandromatTheme,
    },
  },
});
