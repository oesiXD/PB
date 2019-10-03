<template>
  <v-app>
    <v-card
      flat
v-if="usuario"
    >
      <core-app-bar />

      <core-drawer />

      <core-view />

      <core-footer />

    <v-snackbar v-model="notificacion.visible" :color="notificacion.color" multi-line top  :timeout="6000" >
      {{notificacion.mensaje }}
      <v-btn  dark flat @click="ocultarNotificacion">
        Cerrar
      </v-btn>
    </v-snackbar>


    </v-card>

    <v-container
      v-if="!usuario"
      style="max-width: 600px"
    >

      <v-card class="elevation-24">

        <v-toolbar
          color="primary"
          dark
          card
          flat
        >

          <v-toolbar-title>
            Ingresa Tus Credenciales

          </v-toolbar-title>

          <v-layout
            justify-end
            align-center
          >

          </v-layout>

        </v-toolbar>
        <v-card-text>

          <v-text-field
          autofocus
            label="Email"
            type="email"
            v-model="formulario.email"
            :error-messages="errorsEmail"
            @blur="$v.formulario.email.$touch()"
          ></v-text-field>
          <v-text-field
            @keyup.enter="verificar"
            counter
            maxlength="25"
            :type="show2 ? 'text' : 'password'"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show2 = !show2"
            label="Password"
            v-model="formulario.password"
            :error-messages="errorsPassword"
            @blur="$v.formulario.password.$touch()"
          ></v-text-field>

        </v-card-text>
        <v-card-text>
          <v-layout justify-end>
            <v-btn
              class="ma-2"
              @click="verificar"
              :disabled="$v.formulario.$invalid"
              color="secondary"
            > Siguiente </v-btn>
          </v-layout>

        </v-card-text>

      </v-card>
    <v-snackbar v-model="notificacion.visible" :color="notificacion.color" multi-line top  :timeout="6000" >
      {{notificacion.mensaje }}
      <v-btn  dark flat @click="ocultarNotificacion">
        Cerrar
      </v-btn>
    </v-snackbar>


      <v-dialog
        v-model="ocupado.visible"
        max-width="400"
        persistent=""
      >
        <v-card>

          <v-toolbar
            color="secondary"
            dark
            card
          >

            <v-toolbar-title class="subheading"> {{ocupado.titulo}} </v-toolbar-title>

          </v-toolbar>
          <v-card-text>
            {{ocupado.mensaje}}
          </v-card-text>
          <v-card-text>
            <v-progress-linear
              :indeterminate="true"
              color="primary"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>

    </v-container>

  </v-app>
</template>

<script>
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapMutations, mapState,mapGetters } from 'vuex'
import { auth } from '@/firebase'
export default {

  data() {
    return {
      show2: false,
      submitStatus: null,

      formulario: {
        email: '',
        password: '',
      },

    }



  },
  components: {
    CoreDrawer: () => import('@/components/core/Drawer'),
    CoreFooter: () => import('@/components/core/Footer'),
    CoreAppBar: () => import('@/components/core/AppBar'),
    CoreView: () => import('@/components/core/View')
  },
  computed: {
    ...mapState(['notificacion', 'ocupado']),
 ...mapState({usuario: state => state.usuario}),
    ...mapGetters('sesion',['saludo']),

    errorsEmail() {
      let errores = []
      if (!this.$v.formulario.email.$dirty) { return errores }
      if (!this.$v.formulario.email.required) { errores.push('Ingresa tu email.') }
      if (!this.$v.formulario.email.email) { errores.push('Ingresa un email válido.') }
      return errores
    },
    errorsPassword() {
      let errors = []
      if (!this.$v.formulario.password.$dirty) { return errors }
      if (!this.$v.formulario.password.required) { errors.push('Ingresa tu contraseña.') }
      if (!this.$v.formulario.password.minLength) { errors.push('Ingresa un contraseña con almenos 6 caracteres.') }
      if (!this.$v.formulario.password.maxLength) { errors.push('Ingresa un contraseña que no supere los 20 caracteres.') }
      return errors

    },


  },
  validations: {
    formulario: {

      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(20)
      }
    }
  },
  methods: {
    ...mapMutations(['mostrarOcupado', 'ocultarOcupado', 'actualizarUsuario', 'ocultarNotificacion','mostrarExito','mostrarAdvertencia']),

   async verificar() {
      if (this.$v.formulario.$invalid) {
        this.$v.formulario.$touch()
        return
      }

      let ocupado = {
        titulo: 'Validando Credenciales',
        mensaje: 'Estamos validando tu información...'
      }

      this.mostrarOcupado(ocupado)

      try {
        await auth.signInWithEmailAndPassword(this.formulario.email, this.formulario.password)
          this.$store.commit('mostrarExito', this.$store.getters.saludo)
        this.$router.push({ name: 'Dashboard' })
      }
      catch (error) {

        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            this.mostrarAdvertencia('Usuario no válido. Revisa tu correo y contraseña.')
            break

          default:
            this.mostrarError('Ocurrió un error validando la información.')
            break
        }
      }

    finally{

     this.ocultarOcupado()

    }



   }

  }
}
</script>
