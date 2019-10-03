/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [
  {
    path: '',
    // Relative to /src/views
    view: 'Dashboard'
  },
  {
    path: '/user-profile',
    name: 'User Profile',
    view: 'UserProfile'
  },
  {
    path: '/table-list',
    name: 'Table List',
    view: 'TableList'
  },
  {
    path: '/typography',
    view: 'Typography'
  },
  {
    path: '/notifications',
    view: 'Notifications'
  },
  {
    path: '/usuarios',
    view: 'Usuarios'
  },
  {
    path: '/nuevaContraseña',
    view: 'resetpassword'
  },
  {
    path: '/regalos',
    view: 'Regalos'
  },
  {
    path: '/categoria-eventos',
    view: 'CategoriaEventos'
  },
  {
    path: '/eventos',
    view: 'Eventos'
  },
  {
    path: '/pagina-principal',
    view: 'PaginaPrincipal'
  }
]
