import Vue from 'vue'
import App from './components/App.vue'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

import 'modern-css-reset'
import './styles/index.css'

export function createApp () {
  const app = new Vue({
    render: h => h(App)
  })
  return { app }
}
