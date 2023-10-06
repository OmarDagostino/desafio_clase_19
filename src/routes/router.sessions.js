import e, {Router} from 'express'
import {managermd} from '../dao/managermd.js'
import crypto from 'crypto'
export const router = Router ()

router.post ('/registro', async (req,res)=> {
    console.log ("registrito")
console.log (req.body)
let {name, email,password} = req.body
if (!name || !email || !password ) {
    return res.status(400).send('faltan datos')
}

if (!validarCorreoElectronico(email)) {
    return res.status(400).send('el formato del correo electrónico es invalido')
}

const existeUsuario = await managermd.obtenerUsuarioPorEmail(email)
if (existeUsuario) {
    return res.status(400).send('El email informado ya esta registrado')
}

password=crypto.createHmac('sha256','palabraSecreta').update(password).digest('base64')

managermd.crearUsuario(name,email,password)

res.redirect(`/login?usuarioCreado=${email}`)

})

router.post ('/login',async (req,res)=>{
    Let (email, password) = req.body

    if (!email || !password) {
        return res.status(400),send('Faltan datos')
    }
    password=crypto.createHmac('sha256','palabraSecreta').update(password).digest('base64')

    let usuario = await managermd.obtenerUsuarioPorEmail(email)

    if(!usuario) {
        return res.status(401).send('El email informado no esta registrado')
    }

    if (usuario.password !== password) {
        return res.status(401).send('Password incorrecta') 
    }

    req.session.usuario={
        nombre : usuario.name ,
        email : usuario.email
     }

     res.redirect ('/perfil')

})

router.get('/logout', async (req,res) => {

    req.session.destroy(e=> console.error(e)),
    res.redirect('/login?mensaje=logout correcto... !')

})

function validarCorreoElectronico(correo) {
    const expresionRegular = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return expresionRegular.test(correo);
  }
  
  