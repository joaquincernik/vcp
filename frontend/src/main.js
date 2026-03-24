import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import api from './services/api';
const app = createApp(App).use(router);
app.config.globalProperties.$api = api;  // Hace $api disponible en componentes
app.mount('#app');