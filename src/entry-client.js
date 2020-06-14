/*
import Vue from 'vue'
import App from './components/App.vue'
import store from './store'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

import 'normalize.css'
import './styles/index.css'

// eslint-disable-next-line
new Vue ({
  el: '#app',
  store,
  render: h => h(App)
})
*/

import { createApp } from './app'

// Специфичная для клиента логика загрузки...

const { app } = createApp()

// предполагается, что у корневого элемента в шаблоне App.vue есть элемент с `id="app"`
app.$mount('#app')
