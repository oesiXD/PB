<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    :src="image"
    app
    color="grey darken-2"
    dark
    floating
    mobile-break-point="991"
    persistent
    width="260"
  >
    <template v-slot:img="attrs">
      <v-img
        v-bind="attrs"
        gradient="to top, rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)"
      />
    </template>

    <v-list-item two-line>
      <v-list-item-avatar color="white">
        <v-img
          src="https://cdn.vuetifyjs.com/images/logos/v.png"
          height="34"
          contain
        />
      </v-list-item-avatar>

      <v-list-item-title class="title">
        VUETIFY MD
      </v-list-item-title>
    </v-list-item>

    <v-divider class="mx-3 mb-3" />

    <v-list nav>
      <!-- Bug in Vuetify for first child of v-list not receiving proper border-radius -->
      <div />

      <v-list-item
        v-for="(link, i) in links"
        :key="i"
        :to="link.to"
        active-class="primary white--text"
      >
        <v-list-item-action>
          <v-icon>{{ link.icon }}</v-icon>
        </v-list-item-action>

        <v-list-item-title v-text="link.text" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
// Utilities
  import {
    mapMutations,
    mapState
  } from 'vuex'

  export default {
    props: {
      opened: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      links: [
        {
          to: '/',
          icon: 'mdi-view-dashboard',
          text: 'Estadísticas'
        },
        {
          to: '/pagina-principal',
          icon: 'mdi-home-edit',
          text: 'Página Principal'
        },
        {
          to: '/user-profile',
          icon: 'mdi-account',
          text: 'User Profile'
        },
        {
          to: '/table-list',
          icon: 'mdi-clipboard-outline',
          text: 'Table List'
        },
        {
          to: '/typography',
          icon: 'mdi-format-font',
          text: 'Typography'
        },
        {
          to: '/usuarios',
          icon: 'mdi-account',
          text: 'Usuarios'
        },

        {
          to: '/regalos',
          icon: 'mdi-gift',
          text: 'Regalos'
        },
        {
          to: '/categoria-eventos',
          icon: 'mdi-calendar',
          text: 'Categoria Eventos'
        },
        {
          to: '/eventos',
          icon: 'mdi-cake',
          text: 'Eventos'
        },
        {
          to: '/notifications',
          icon: 'mdi-bell',
          text: 'Notificaciones'
        }
      ]
    }),

    computed: {
      ...mapState('app', ['image', 'color']),
      inputValue: {
        get () {
          return this.$store.state.app.drawer
        },
        set (val) {
          this.setDrawer(val)
        }
      }
    },

    methods: {
      ...mapMutations('app', ['setDrawer', 'toggleDrawer'])
    }
  }
</script>
