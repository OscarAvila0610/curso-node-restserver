const bcryptjs = require('bcryptjs');
const { response } = require("express");
const { json } = require('express/lib/response');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const Usuario = require('../models/usuario');


const login = async(req, res = response) =>{

    const {correo, password} = req.body;

    try {

        //verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if (!usuario){
            return res.status(400).json({
                mgs: 'Usuario / Password no son correctos - correo'
            });
        }
        //Si el usuario esta activo en BD
        if (!usuario.estado){
            return res.status(400).json({
                mgs: 'Usuario / Password no son correctos - estado false'
            });
        }
        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                mgs: 'Usuario / Password no son correctos - password'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
    
}

const googleSignIn = async(req, res = response) =>{
    
    const {id_token} = req.body;

    try {
        const {nombre, img, correo} = await googleVerify(id_token);

        console.log(nombre, img, correo);

        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            //tengo que crearlo
            const data = {
                nombre,
                correo,
                rol:'USER_ROL',
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario(data);
            console.log(usuario);
            await usuario.save();
        }

        //Si el usuario en DB
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

       // Generar el JWT

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

    
}

module.exports = {
    login,
    googleSignIn
}