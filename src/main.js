import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLocalStorage from 'vue-localstorage'
import { shell } from 'electron'
const remote = require('electron').remote

Vue.config.productionTip = false
Vue.prototype.$shell = shell
Vue.prototype.$win = remote.getCurrentWindow()
Vue.use(VueLocalStorage)

new Vue({
  router,
  store,
  mounted() {
    this.$router.push('/')
  },
  render: h => h(App)
}).$mount('#app')
