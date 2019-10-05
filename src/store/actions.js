// https://vuex.vuejs.org/en/actions.html
import { auth, db } from '@/firebase'

export default {
  async  iniciarSesion({ commit,getters }, uid) {
    try {
      let doc = await db.collection('usuarios')
                        .doc(uid)
                        .get()

      if(doc.exists) {
        let usuario = doc.data()
        commit('actualizarUsuario', usuario)
        commit('mostrarExito', getters.saludo, { root: true })
      }
      else {

      }
    }
    catch (error) {
      commit('mostrarError', 'Ocurrió un error consultando tu información.', { root: true })
    }

  },
  cerrarSesion({ commit }) {
    auth.signOut()
    commit('actualizarUsuario', null)
  }

}
