const Role = require("../models/role");
const {Usuario, Categoria, Producto} = require("../models");

const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado en la BD`);
  }
};

const existeEmail = async(correo = '') =>{
    const existe = await Usuario.findOne({correo});
    if(existe){
        throw new Error(`El correo: ${correo} ya esta registrado en la BD`)
    }
}

const existeUsuarioPorID = async(id) =>{
  const existeUsuario = await Usuario.findById(id);
  if(!existeUsuario){
      throw new Error(`El id: ${id} no existe`)
  }
}

//Personalizados Categorias
const existeCategoriaPorId = async(id) =>{
  const existeCategoria = await Categoria.findById(id);
  if(!existeCategoria){
      throw new Error(`El id: ${id} no existe`)
  }
}

//Personalizados Productos
const existeProductoPorId = async(id) =>{
  const existeProducto = await Producto.findById(id);
  if(!existeProducto){
      throw new Error(`El id: ${id} no existe`)
  }
}

//Validar las colecciones permitidas

const coleccionesPermitidas = (coleccion = '', colecciones = []) =>{

    const incluida = colecciones.includes(coleccion);
    if(!incluida){
      throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
    }

    return true;
}



module.exports = {
  esRoleValido,
  existeEmail,
  existeUsuarioPorID,
  existeCategoriaPorId,
  existeProductoPorId,
  coleccionesPermitidas
};
