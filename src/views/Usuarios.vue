<template>
  <v-layout
    align-center
    justify-center
  >
    <v-flex xs12>

<v-card  color="red" height="100px" v-if="rango =='user'">

</v-card>

      <v-container  v-if="rango == 'admin'"
        fill-height
        fluid
        grid-list-xl
      >

        <v-row>

          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              @blur="$v.f2.email.$touch()"
              :error-messages="erroresEmail"
              v-model="f2.email"
              label="Email"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              @blur="$v.f2.password.$touch()"
              counter
              :type="show2 ? 'text' : 'password'"
              :append-icon="show2 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
              @click:append="show2 = !show2"
              :error-messages="erroresPassword"
              v-model="f2.password"
              label="Password"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              @blur="$v.f2.repetirPassword.$touch()"
              :error-messages="erroresRepetirPassword"
              v-model="f2.repetirPassword"
              label="Repetir Password"
              type="password"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              label="Nombre"
              v-model="f2.nombres"
              :error-messages="erroresNames"
              @blur="$v.f2.nombres.$touch()"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              :error-messages="erroresApellidos"
              @blur="$v.f2.apellidos.$touch()"
              v-model="f2.apellidos"
              label="Apellido"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            sm="6"
            md="4"
          >

            <vue-tel-input
              :error-messages="erroresTelefono"
              @blur="$v.f2.telefono.$touch()"
              v-model="f2.telefono"
            ></vue-tel-input>

          </v-col>

          <v-col
            cols="12"
            sm="6"
            md="4"
          >
            <v-dialog
              ref="dialog"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="fechaNacimiento" label="fecha de nacimiento" prepend-icon="mdi-calendar-month" readonly v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="calendario"
                :max="fechaMaxima" v-model="fechaNacimiento" reactive locale="es-co" class="elevation-3"  min="1950-01-01" >
                <v-spacer></v-spacer>
                <v-layout
                  justify-end
                  justify-space-between
                >
                  <v-btn
                    text
                    color="secondary"
                  @click="$refs.dialog.save(fechaNacimiento=null)"
                  >
                    Cancel
                  </v-btn>
                  <v-btn text color="secondary"  @click="$refs.dialog.save(fechaNacimiento)">
                    OK
                  </v-btn>

                </v-layout>
              </v-date-picker>
            </v-dialog>
          </v-col>

          <v-col   cols="12" sm="6" md="4">
           <v-text-field label="foto perfil" v-model="f2.foto"> </v-text-field>

          </v-col>

          <v-col cols="12">
            <v-textarea
              class="purple-input"
              label="About Me"
              value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            />
          </v-col>



<v-col justify="space-around" >

    <v-layout align-center justify-space-between column fill-height>


<v-switch   class="mx-2" v-model="cargo"  v-for="rango in datosRango" :key="rango.id" :label="rango.nombre" :value="rango.nombre"></v-switch >

    </v-layout>


</v-col>



          <v-col
            cols="12"
            class="text-right"
          >
            <v-btn
              color="success"
             @click="registrar" :disabled=" $v.f2.$invalid"
            >
             registrar
            </v-btn>
          </v-col>
        </v-row>

      </v-container>

 <v-container
        fill-height
        fluid
        grid-list-xl
      >
        <v-row justify="center">
          <v-col cols="12">
            <material-card
              color="green"
              title="Usuarios"
            >

              <v-card-title>
                Usuarios En el sistema
                <div class="flex-grow-1"></div>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-table-search"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="headers"
                :items="desserts"
                :search="search"
              ></v-data-table>

            </material-card>
          </v-col>

        </v-row>
      </v-container>

    </v-flex>
  </v-layout>

</template>
<script>
import { nombreCompuesto } from '@/utils/validaciones.js'
import { required, email, minLength, maxLength, sameAs } from 'vuelidate/lib/validators'
import { auth, db, firebase } from '@/firebase'
import { mapMutations, mapGetters, mapState } from 'vuex'
export default {
  name: 'Registro',
  data() {
    return {
      vista: 1,
      fechaNacimiento: null,
      show2: false,
      fechaMaxima: null,
      cargo:'',
 datosRango: [],
      f2: {
        nombres: '',
        apellidos: '',
        telefono:'',
        email: '',
        password: '',
        repetirPassword: '',
        foto:'',

      },
      vide: 'true',
      submitStatus: null,

      search: '',
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'left',
          sortable: false,
          value: 'name',
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' },
      ],
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%',
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '1%',
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: '7%',
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: '8%',
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%',
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: '0%',
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: '2%',
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: '45%',
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: '22%',
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: '6%',
        },
      ],





    }
  },

  computed: {
rango(){

if(this.usuario && this.usuario.userName == 'admin'){

return 'admin'

}else(this.usuario && this.usuario.userName == 'user')


   return 'user'



},


    ...mapState({ usuario: state => state.usuario }),
    ...mapGetters('sesion', ['saludo']),
    erroresEmail() {
      let errores = []
      if (!this.$v.f2.email.$dirty) { return errores }
      if (!this.$v.f2.email.required) { errores.push('Ingresa tu email.') }
      if (!this.$v.f2.email.email) { errores.push('Ingresa un email válido.') }
      return errores
    },
    erroresPassword() {
      let errores = []
      if (!this.$v.f2.password.$dirty) { return errores }
      if (!this.$v.f2.password.required) { errores.push('Ingresa tu password.') }
      if (!this.$v.f2.password.minLength) { errores.push('Ingresa al menos 6 caracteres.') }
      if (!this.$v.f2.password.maxLength) { errores.push('Ingresa máximo 20 caracteres.') }
      return errores
    },
    erroresRepetirPassword() {
      let errores = []
      if (!this.$v.f2.repetirPassword.$dirty) { return errores }
      if (!this.$v.f2.repetirPassword.sameAs) { errores.push('Las contraseñas no coinciden.') }
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
  created() {
    this.consultarCargo()
  },
  methods: {
    ...mapMutations(['mostrarOcupado', 'ocultarOcupado', 'actualizarUsuario', 'mostrarExito', 'mostrarError', 'mostrarAdvertencia']),


 async consultarCargo() {
      try {
        let docs = await db.collection('cargos')
                           .get()


        docs.forEach(doc => {
          this.datosRango.push(doc.data())
        })

        if (this.datosRango.length == 0) {
          this.mostrarAdvertencia('No hay rangos disponibles en el momento.')
        }
      }
      catch (error) {
        this.mostrarError('Ocurrió un error consultando los rangos. Inténtalo más tarde.')
      }
    },

    async guardarUsuario(uid) {
      let usuario = {
        uid,
        correo: this.f2.email,
        userName: 'user',
        nombres: this.f2.nombres,
        telefono: '111111111',
        apellidos: this.f2.apellidos,
        fechaNacimiento : new Date(this.fechaNacimiento),
        descripcion: 'Descripción',
         fotoPerfil: this.f2.foto
      }


      await db.collection('usuarios')
        .doc(usuario.uid)
        .set(usuario)

      this.actualizarUsuario(usuario)

    },


    async registrar() {
      if (this.$v.fechaNacimiento.$invalid) { return }

      try {
        this.mostrarOcupado({ titulo: 'Creando Registro', mensaje: 'Estamos registrando tu información...' })
        let cred = await auth.createUserWithEmailAndPassword(this.f2.email, this.f2.password)
        this.guardarUsuario(cred.user.uid)
        this.$store.commit('mostrarExito', ('datos guardados'))
      }
      catch (error) {


        switch (error.code) {
          case 'auth/email-already-in-use':
            this.mostrarAdvertencia('Ya se ha registrado esta dirección de email con anterioridad')
            break

          default:
            this.mostrarError('Ocurrió un error registrando tu cuenta. Inténtalo más tarde.')
            break
        }
      }
      finally {
        this.ocultarOcupado()
      }
    },


  },
  validations: {

    f2: {
      nombres: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(20),
        nombreCompuesto
      },
      apellidos: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(20),
        nombreCompuesto
      },
       telefono:{
        required,
        minLength: minLength(9),
        maxLength: maxLength(11),
       },

      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(20)
      },
      repetirPassword: {
        sameAs: sameAs('password')
      }

    },
    fechaNacimiento: {
      required
    }
  }
}
</script>

<style >
</style>
