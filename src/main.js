/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

// vue router
import router from '@/router'

// Google Analytics
import { useGtag } from "vue-gtag-next";

const app = createApp(App)

registerPlugins(app)

app.use(router)
app.use(useGtag, {
  property: { id: `${import.meta.env.VITE_GTAG_ID}` }
})
app.mount('#app')
