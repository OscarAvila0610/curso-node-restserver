const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos, validarJWT, esAdminRol } = require("../middlewares");

const {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto
} = require('../controllers/productos');

const { existeCategoriaPorId, existeProductoPorId } = require("../helpers/db-validators");

const router = Router();

//obtener productos - publico
router.get("/", obtenerProductos);

//Obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProducto
);

//Crear categoria - privado - cualquier persona con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "No es un id de Mongo").isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos,
  ],
  crearProducto
);

//Actualizar por id - privado - cualquiera con token valido
router.put("/:id", [
    validarJWT,
    // check("categoria", "No es un id de Mongo").isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

//Borrar una categoria - solo si es Admin
router.delete("/:id",[
    validarJWT,
    esAdminRol,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
] ,borrarProducto);

module.exports = router;