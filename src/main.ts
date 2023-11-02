import { createApp } from 'vue';
import App from './App.vue';
import { router } from './Router/index';
import ElementPlus from 'element-plus';
import { store } from './store';
import './reset.css';
import 'element-plus/dist/index.css';
import './style.css';

const savedRoute = localStorage.getItem('savedRoute')

if (savedRoute) {
  router.push(savedRoute)
}

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.use(store);
app.mount('#app');
