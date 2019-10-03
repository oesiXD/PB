<template>
  <v-container
    fill-height
    fluid
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
      >
        <material-card
          color="green"
          title="Edit Profile"
          text="Complete your profile"
        >
          <v-form>
            <v-container class="py-0">
              <v-row>


                <v-col cols="12" md="4" >
                  <v-text-field class="purple-input" label="User Name"/>
                </v-col>

                <v-col cols="12" md="4" >
                  <v-text-field label="Email Address" class="purple-input"/>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="First Name"  class="purple-input"/>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="Last Name" class="purple-input" />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    class="purple-input"
                    label="About Me"
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                  />
                </v-col>

                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn color="success">
                    Update Profile
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </material-card>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <material-card class="v-card-profile">
          <v-avatar
            slot="offset"
            class="mx-auto d-block elevation-6"
            size="130"
          >
            <img
              :src="usuario.fotoPerfil"
            >
          </v-avatar>
          <v-card-text class="text-center">
            <h6 class="overline mb-3">

            </h6>

            <h4 class="font-weight-light">
                  {{usuario.nombres}} {{usuario.apellidos}}
            </h4>

            <p class="font-weight-light">
              Don't be scared of the truth because we need to restart the human foundation in truth And I love you like Kanye loves Kanye I love Rick Owens’ bed design but the back is...
            </p>

            <v-btn @click="solicitudPassword = true" color="success">
              Cambiar contaraseña
            </v-btn>
          </v-card-text>
        </material-card>


         <v-dialog v-model="solicitudPassword" max-width="400" persistent>
        <v-card>
          <v-toolbar color="primary" dark card>
            <v-toolbar-title>
              Restablecer Contraseña
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="subheading">
            Ingresa la dirección de email con la cual te registraste.
          </v-card-text>
          <v-card-text>
            <v-text-field label="Email" autofocus v-model="email" :error-messages="erroresEmailEnvio" @blur="$v.email.$touch()"></v-text-field>
          </v-card-text>
          <v-card-text>
            <v-layout>
              <v-flex xs6>
                <v-layout justify-start>
                  <v-btn @click="solicitudPassword = false">Cancelar</v-btn>
                </v-layout>
              </v-flex>
              <v-flex xs6>
                <v-layout justify-end>
                  <v-btn color="secondary" @click="enviarSolicitudPassword" :depressed="$v.email.$invalid" :disabled="$v.email.$invalid">Enviar</v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-dialog>

      </v-col>



    </v-row>

  </v-container>
</template>

<script>
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapMutations, mapState,mapGetters } from 'vuex'
import { auth } from '@/firebase'
  export default {

data() {
  return {

   email: '',
   solicitudPassword: false,
  }
},

 computed:{
...mapState({usuario: state => state.usuario}),

   erroresEmailEnvio() {
      let errores = []
      if (!this.$v.email.$dirty) { return errores }
      if (!this.$v.email.required) { errores.push('Ingresa tu email.') }
      if (!this.$v.email.email) { errores.push('Ingresa un email válido.') }
      return errores
    },
 },


   validations: {
      email: {
        required,
        email
      },
  },


  methods:{
    ...mapMutations(['mostrarOcupado', 'ocultarOcupado', 'actualizarUsuario', 'ocultarNotificacion','mostrarExito','mostrarAdvertencia']),

   async enviarSolicitudPassword() {
      this.solicitudPassword = false
      this.mostrarOcupado({ titulo: 'Enviando Solicitud', mensaje: 'Enviando solicitud de restablecimiento de constraseña...' })

      try {
        await auth.sendPasswordResetEmail(this.email)
        this.mostrarExito('Se ha enviado la solicitu de restablecimiento de contraseña.')
      }
      catch (error) {
        this.mostrarError('Ocurrió un error enviando la solicitud.')
      }
      finally {
        this.ocultarOcupado()
      }

  },
  }



  }
</script>
