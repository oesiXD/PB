// https://vuex.vuejs.org/en/actions.html
import { auth } from '@/firebase'

export default {
  iniciarSesion({ commit }, uid) {
    let usuario = {
      uid,
      userName: 'AndresXD',
      nombres: 'Andres',
      apellidos: 'López',
      sexo: 'M',
      descripcion: 'Descripcion',
      biografia: 'https://www.facebook.com/profile.php?id=100006544260839',
      fotoPerfil: 'https://scontent.fscl3-1.fna.fbcdn.net/v/t1.0-9/37783653_2245034152391372_5930065232532602880_n.jpg?_nc_cat=110&_nc_oc=AQkW3volK8IrAhTQvPyAz3B5MTsJVgqsekNJCifLRLwNhJfPu1ruEHHs6qUQx1ez220&_nc_ht=scontent.fscl3-1.fna&oh=532484e15167ec06a74500a709c81b91&oe=5DF3681E'
    }

    commit('actualizarUsuario', usuario)
  },
  cerrarSesion({ commit }) {
    auth.signOut()
    commit('actualizarUsuario', null)
  }

}
