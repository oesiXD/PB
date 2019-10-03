import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuelidate from 'vuelidate'
import './plugins'
import vuetify from './plugins/vuetify'
import { sync } from 'vuex-router-sync'
import { auth } from './firebase'

sync(store, router)
Vue.use(Vuelidate)
Vue.config.productionTip = false

auth.onAuthStateChanged(user => {
  if (user) {
    store.dispatch('iniciarSesion', user.uid)
  }
  else {
    store.dispatch('cerrarSesion')
  }
})


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
