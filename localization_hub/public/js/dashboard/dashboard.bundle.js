import { createApp } from 'vue';
import App from './App.vue';

// Export a function that Frappe can call to mount the Vue app
window.initDashboardApp = function(element) {
    const app = createApp(App);
    app.mount(element);
    return app;
};