const nombreCompuesto = value =>{
    // eslint-disable-next-line 
 if(value == undefined || value == null || value ==''){

 }
 return /^(?! )(?!.* {2})[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$/.test(value)
}

export {nombreCompuesto}