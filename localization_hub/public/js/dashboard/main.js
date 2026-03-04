import { createApp } from 'vue';
import App from 'localization_hub/public/js/App.vue';

// Initialize the Vue app
window.initDashboardApp = function(selector) {
  const app = createApp(App);
  app.mount(selector);
  return app;
};