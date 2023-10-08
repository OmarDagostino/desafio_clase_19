import express from 'express';
import handlebars from 'express-handlebars';
import {Router} from 'express';
import path from 'path';
import __dirname from '../util.js';
import {cartModel, productModel} from '../dao/models/user.model.js';
import { ObjectId } from 'mongodb';


const router = express.Router()


const auth=(req,res,next)=>{
    if (req.session.usuario) {
      
        next ()
    } else {
        return res.redirect('/login')
    }
}

const auth2=(req,res,next)=>{
    if (req.session.usuario) {
        return res.redirect('/products')  
    } else {
        next ()
    }
}

let mostrarMenu0 = true;
let mostrarMenu1 = true;
let mostrarMenu2 = true;
let mostrarMenu3= true;
let mostrarMenu4 = true;
let mostrarMenu5 = true;


const app = express();
app.engine('handlebars',handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

router.get('/', auth, (req,res)=>{
  mostrarMenu0=true;
  mostrarMenu1=true;
  mostrarMenu2=true;
  mostrarMenu3=true;
  mostrarMenu4=true;
  mostrarMenu5=true;
  let typeofuser=req.session.usuario.typeofuser

    res.setHeader('Content-Type','text/html');
    res.status(200).render('home',{typeofuser,mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5});
  });
  router.get('/admin', auth, (req,res)=>{
    mostrarMenu0=false;
    mostrarMenu1=false;
    mostrarMenu2=false;
    mostrarMenu3=false;
    mostrarMenu4=false;
    mostrarMenu5=true;
    let typeofuser=req.session.usuario.typeofuser
    let imageUrl = '../assets/campo_de_flores.jpg'
  
      res.setHeader('Content-Type','text/html');
      res.status(200).render('admin',{imageUrl, typeofuser,mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5});
    });
router.get('/login', auth2, (req,res)=>{
  mostrarMenu0=true;
  mostrarMenu1=true;
  mostrarMenu2=false;
  mostrarMenu3=false;
  mostrarMenu4=false;
  mostrarMenu5=false;
  let typeofuser='' ;
    res.setHeader('Content-Type','text/html');
    res.status(200).render('login',{typeofuser, mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5});
  });

router.get('/registro',auth2,  (req,res)=>{
  mostrarMenu0=true;
  mostrarMenu1=false;
  mostrarMenu2=true;
  mostrarMenu3=false;
  mostrarMenu4=false;
  mostrarMenu5=false;
  let typeofuser='';
    res.setHeader('Content-Type','text/html');
    res.status(200).render('registro',{typeofuser,mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5});
  }
  
    )
router.get('/chat', (req,res)=> {
    res.setHeader('Content-Type','text/html');
    res.status(200).render('chat');
  })
  
router.get('/products', auth,  async (req,res) => {
    try {
     
      const name = req.session.usuario.nombre
      const cartId = req.session.usuario.carrito
      const product = await productModel.find({}).exec();
      const renderedProducts = product.map(product => {
        return {
          _id: product._id,
          title: product.title,
          description: product.description,
          price: product.price,
          code: product.code,
          category: product.category,
          stock: product.stock
        };
        
      });
      res.setHeader('Content-Type', 'text/html');
      mostrarMenu0=true;
      mostrarMenu1=false;
      mostrarMenu2=false;
      mostrarMenu3=false;
      mostrarMenu4=true;
      mostrarMenu5=true;
      let typeofuser=req.session.usuario.typeofuser;
      
      res.status(200).render('products', { renderedProducts,name, cartId, typeofuser, mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5}); 
    } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
    }
  })
  
router.get('/carts/:cid',  async (req,res)  => { 
      try {
      const cartId = req.params.cid;
      const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
      if (!validObjectId) { 
        res.status(404).send("Identificador del carrito invalido");
        } else {
          const cart = await cartModel.findOne({ _id : cartId }).populate('products.productId').exec();
          
          if (cart) {
                  
            const transformedCart = {
              cartId,
              products: cart.products.map(product => ({
                productId: product.productId._id,
                title: product.productId.title,
                description: product.productId.description,
                price: product.productId.price,
                code: product.productId.code,
                stock: product.productId.stock,
                category: product.productId.category,
                cantidad: product.quantity,
              })),
            };
          
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('carts', { cart: transformedCart });
          } else {
            res.status(404).send('Carrito no encontrado');
          }
        }
    } catch (error) {
      console.error(error)
      res.status(500).send('*** Error en el servidor');
    }
   
  });

  router.get('/carts', auth, async (req,res)  => { 
    try {
    const cartId = req.session.usuario.carrito;
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador del carrito invalido");
      } else {
        const cart = await cartModel.findOne({ _id : cartId }).populate('products.productId').exec();
        
        if (cart) {
                
          const transformedCart = {
            cartId,
            products: cart.products.map(product => ({
              productId: product.productId._id,
              title: product.productId.title,
              description: product.productId.description,
              price: product.productId.price,
              code: product.productId.code,
              stock: product.productId.stock,
              category: product.productId.category,
              cantidad: product.quantity,
            })),
          };
          mostrarMenu0=true;
          mostrarMenu1=false;
          mostrarMenu2=false;
          mostrarMenu3=true;
          mostrarMenu4=false;
          mostrarMenu5=true;
          let typeofuser=req.session.usuario.typeofuser;
          res.setHeader('Content-Type', 'text/html');
          res.status(200).render('carts', { cart: transformedCart, typeofuser, mostrarMenu0,mostrarMenu1,mostrarMenu2,mostrarMenu3,mostrarMenu4,mostrarMenu5 });
        } else {
          res.status(404).send('Carrito no encontrado');
        }
      }
  } catch (error) {
    console.error(error)
    res.status(500).send('*** Error en el servidor');
  }
 
});

  export default router;