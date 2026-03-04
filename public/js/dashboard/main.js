import { createApp } from 'vue';
import App from '../App.vue';

window.initDashboardApp = function(selector) {
  const app = createApp(App);
  app.mount(selector);
  return app;
};
