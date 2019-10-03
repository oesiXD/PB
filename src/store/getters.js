// https://vuex.vuejs.org/en/getters.html

export default {
  saludo(state) {
    if (!state.usuario) {
      return ''
    }

    let vocal = state.usuario.sexo && state.usuario.sexo == 'F' ? 'a' : 'o'
    return `¡Bienvenid${vocal} ${state.usuario.nombres}!`
  },

  Despadida(state){

    if(!state.usuario) {return ''}

    return  `Esperamos que regreses pronto por aqui ${state.usuario.nombres}!`

  }
}
