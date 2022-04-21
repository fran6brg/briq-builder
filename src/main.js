import { createApp } from 'vue'

// Load Tailwind CSS
import './index.css'

import './FontAwesome';

window.gsw = true;

// Fake polyfill to make starknet.js work.
window.Buffer = {
    alloc: function() {},
};



import App from './App.vue'
export var app = createApp(App);

// Routing
import { createWebHistory, createRouter } from "vue-router";
import { routes } from './Routes'
const router = createRouter({
    history: createWebHistory(),
    routes,
});
app.use(router);

import { setupMonitoring } from './Monitoring';
setupMonitoring(app, router);

import Button from './components/generic/Button.vue';
import CheckboxBtn from './components/generic/CheckboxBtn.vue';
import Toggle from './components/generic/Toggle.vue';
import Hotkey from './components/generic/Hotkey.vue';
import Window from './components/generic/Window.vue';

// Load general components
app.component("Btn", Button);
app.component("Hotkey", Hotkey);
app.component("CheckboxBtn", CheckboxBtn);
app.component("Toggle", Toggle);
app.component("Window", Window);

async function start()
{
    app.mount('#app');
}

start();
