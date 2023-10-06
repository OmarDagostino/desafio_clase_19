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
        return res.redirect('/perfil')  
    } else {
        next ()
    }
}

const app = express();
app.engine('handlebars',handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

router.get('/', auth, (req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('home');
  });

router.get('/login', auth2, (req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('login');
  });

router.get('/perfil',auth, (req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('perfil');
  });

router.get('/registro',auth2,  (req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('registro');
  }
  
    )
router.get('/chat', (req,res)=> {
    res.setHeader('Content-Type','text/html');
    res.status(200).render('chat');
  })
  
router.get('/products', auth,  async (req,res) => {
    try {
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
      res.status(200).render('products', { renderedProducts }); 
    } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
    }
  })
  
router.get('/carts/:cid', async (req,res)  => { 
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

  export default router;