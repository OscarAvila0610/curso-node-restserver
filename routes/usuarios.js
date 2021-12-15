const { Router } = require("express");
const { check } = require("express-validator");

const {validarCampos, validarJWT, esAdminRol, tieneRole} = require('../middlewares');

const { esRoleValido, existeEmail, existeUsuarioPorID } = require("../helpers/db-validators");

const {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
} = require("../controllers/usuarios");



const router = Router();

router.get("/", usuariosGet);

router.put("/:id", [
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom(existeUsuarioPorID),
  check('rol').custom( esRoleValido ),
  validarCampos
] ,usuariosPut);

router.post("/", [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password debe de ser mayor a 6 caracteres').isLength({min: 6}),
  check('correo', 'El correo no es valido').isEmail(),
  check('correo').custom(existeEmail),
  // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('rol').custom( esRoleValido ),
  validarCampos
],usuariosPost);

router.delete("/:id",[
  validarJWT,
  // esAdminRol,
  tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom(existeUsuarioPorID),
  validarCampos
] ,usuariosDelete);

router.patch("/", usuariosPatch);

module.exports = router;
