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
          <v-form v-model="editarNombresApellidoFechaTag" >
            <v-container class="py-0" >
              <v-row >

                <v-col cols="12" md="6" >
                  <v-text-field label="Nombre" v-model="f2.nombres"  :error-messages="erroresNames" @blur="$v.f2.nombres.$touch()" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field   :error-messages="erroresApellidos" @blur="$v.f2.apellidos.$touch()"  v-model="f2.apellidos" label="Apellido" />
                </v-col>
        <v-col cols="12" sm="6" md="4" >

          <vue-tel-input :error-messages="erroresTelefono" @blur="$v.f2.telefono.$touch()"  v-model="f2.telefono"></vue-tel-input>

              </v-col>


                    <v-col cols="12" sm="6" md="4" >
        <v-dialog ref="dialog"  persistent  width="290px">
          <template v-slot:activator="{ on }">
            <v-text-field v-model="f2.fechaN" label="Picker in dialog" prepend-icon="mdi-calendar-month" readonly v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="f2.fechaN" scrollable locale="es-co">
            <div class="flex-grow-1"></div>
            <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.dialog.save(f2.fechaN)">OK</v-btn>
          </v-date-picker>
        </v-dialog>
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
                  <v-btn color="success"   @click="guardarNombresApellidoFechaTag" :disabled="$v.f2.$invalid" >
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
            {{usuario.userName}}
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
            <v-text-field disabled  label="Email" autofocus v-model="email" :error-messages="erroresEmailEnvio" @blur="$v.email.$touch()"></v-text-field>
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

import{nombreCompuesto} from '@/utils/validaciones.js'
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapMutations, mapState,mapGetters } from 'vuex'
import { auth ,db } from '@/firebase'
  export default {

data() {
  return {

   email: '',
   solicitudPassword: false,

    f2:{
        nombres:'',
        apellidos:'',
        fechaN:'',
        telefono:''
    }

  }
},


 computed:{
...mapState({usuario: state => state.usuario}),

  editarNombresApellidoFechaTag(){
  this.f2.nombres = this.usuario.nombres
  this.f2.apellidos = this.usuario.apellidos
  let timestamp = this.usuario.fechaNacimiento

  this.f2.fechaN = new Date(timestamp.seconds * 1000).toISOString().substr(0, 10);

  this.email = this.usuario.email

  this.f2.telefono = this.usuario.telefono


  },




   erroresEmailEnvio() {
      let errores = []
      if (!this.$v.email.$dirty) { return errores }
      if (!this.$v.email.required) { errores.push('Ingresa tu email.') }
      if (!this.$v.email.email) { errores.push('Ingresa un email válido.') }
      return errores
    },

       erroresNames() {
      let errores = []
      if (!this.$v.f2.nombres.$dirty) { return errores }
      if (!this.$v.f2.nombres.required) { errores.push('Ingresa tus nombres.') }
      if (!this.$v.f2.nombres.minLength) { errores.push('Ingresa al menos 3 caracteres.') }
      if (!this.$v.f2.nombres.maxLength) { errores.push('Ingresa máximo 20 caracteres.') }
      if (!this.$v.f2.nombres.nombreCompuesto) { errores.push('Ingresa un nombre válido.') }
      return errores

    },
      erroresApellidos() {
      let errores = []
      if (!this.$v.f2.apellidos.$dirty) { return errores }
      if (!this.$v.f2.apellidos.required) { errores.push('Ingresa tus apellidos.') }
      if (!this.$v.f2.apellidos.minLength) { errores.push('Ingresa al menos 3 caracteres.') }
      if (!this.$v.f2.apellidos.maxLength) { errores.push('Ingresa máximo 20 caracteres.') }
      if (!this.$v.f2.apellidos.nombreCompuesto) { errores.push('Ingresa un apellido válido.') }
      return errores
    },
     erroresTelefono() {
      let errores = []
      if (!this.$v.f2.telefono.$dirty) { return errores }
      if (!this.$v.f2.telefono.required) { errores.push('Ingresa tu telefono.') }
      if (!this.$v.f2.telefono.minLength) { errores.push('el numero ingresado no es Valido') }
      if (!this.$v.f2.telefono.maxLength) { errores.push('el numero ingresado tiene demasiados digitos') }
      return errores
    },
 },


   validations: {
      email: {
        required,
        email
      },

    f2:{
      nombres:{
      required,
        minLength: minLength(3),
        maxLength: maxLength(20),
      nombreCompuesto
      },
      apellidos:{
       required,
        minLength: minLength(3),
        maxLength: maxLength(20),
        nombreCompuesto
      },
      telefono:{
        required,
         minLength: minLength(9),
        maxLength: maxLength(11),
      }
    },
    fechaNacimiento:{
      required
    }

  },


  methods:{
    ...mapMutations(['actualizarNombresApellidos','mostrarOcupado', 'ocultarOcupado', 'actualizarUsuario', 'ocultarNotificacion','mostrarExito','mostrarAdvertencia']),

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
    async  guardarNombresApellidoFechaTag(){
    if(this.f2.nombres == this.usuario.nombres &&
     this.f2.apellidos == this.usuario.apellidos &&
      this.f2.telefono == this.usuario.telefono){
     this.mostrarAdvertencia(  'los datos a Guardar son iguales no hay nesecidad de guardarlos ' )
       return
    }

        this.mostrarExito('Estamos guardando tus nombres y apellidos...')

       try {
        await db.collection('usuarios')
                .doc(this.usuario.uid)
                .update({ nombres: this.f2.nombres, apellidos: this.f2.apellidos ,telefono: this.f2.telefono})

        this.actualizarNombresApellidos({ nombres: this.f2.nombres, apellidos: this.f2.apellidos ,telefono: this.f2.telefono})


      }
      catch (error) {
        this.mostrarError('Ocurrió un error actualizando tus datos.')
      }
      finally {
        this.ocultarOcupado()
      }

  }

  }



  }
</script>
