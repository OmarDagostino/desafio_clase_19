import {Router} from 'express'
import bodyParser from 'body-parser'
import {managermd} from '../dao/managermd.js'
import crypto from 'crypto'
export const router = Router ()
router.use(bodyParser.urlencoded({ extended: true }));

// Registro de un nuevo usuario 

router.post ('/registro', async (req,res)=> {
    const name = req.body.name
    const email= req.body.email
    let password = req.body.password
if (!name || !email || !password ) {
    return res.redirect('/registro?error=faltan datos')
}

if (!validarCorreoElectronico(email)) {
    return res.redirect('/registro?error=el formato del correo electrónico es invalido')
}

const existeUsuario = await managermd.obtenerUsuarioPorEmail(email)
if (existeUsuario) {
    return res.redirect('/registro?error=El email informado ya esta registrado')
}

password=crypto.createHmac('sha256','palabraSecreta').update(password).digest('base64')

managermd.crearUsuario(name,email,password)

res.redirect(`/login?usuarioCreado=${email}`)

})

// Login de un usuario o del administrador

router.post ('/login',async (req,res)=>{
    let email = req.body.email
    let password = req.body.password
    const emailAdministrador = 'adminCoder@coder.com'
    const passwordAdministrador = 'adminCod3r123'

    if (email===emailAdministrador){
        if (password === passwordAdministrador) {
            req.session.usuario={
                nombre : 'Administrador',
                carrito : null,
                email : email,
                typeofuser : 'admin',
                 };  

                return res.redirect ('/admin')
        } else {
            return res.redirect('/login?error=Password incorrecta')
        }      
    }

    if (!email || !password) {
       return res.redirect('/login?error=Faltan datos')
    }
    password=crypto.createHmac('sha256','palabraSecreta').update(password).digest('base64')

    let usuario = await managermd.obtenerUsuarioPorEmail(email)

    if(!usuario) {
        return res.redirect('/login?error=El email informado no esta registrado')
    }

    if (usuario.password !== password) {
        return res.redirect('/login?error=Password incorrecta')
    }

    req.session.usuario={
        nombre : usuario.name ,
        carrito : usuario.cartId,
        email : usuario.email,
        typeofuser : 'user'
     }

     res.redirect ('/products')

})

// logOut

router.get('/logout', async (req,res) => {

    req.session.destroy(e=> console.error(e)),
    res.redirect('/login?mensaje=logout correcto... !')

})

function validarCorreoElectronico(correo) {
    const expresionRegular = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return expresionRegular.test(correo);
  }
  
  