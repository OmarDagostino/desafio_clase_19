import mongoose from 'mongoose';
import {cartModel} from './models/user.model.js';
import {productModel} from './models/user.model.js';
import {userModel} from './models/user.model.js';
import {Router} from 'express';
import { ObjectId } from 'mongodb';

const router = Router ()

// Conectar a la base de datos MongoDB Atlas
mongoose.connect('mongodb+srv://omardagostino:laly9853@cluster0.x1lr5sc.mongodb.net/ecommerce1');

export const managermd = { 
// Funciones para carritos

// Obtener un carrito por su ID
obtenerCarrito : async (cid)=>
{
  try {
    const cartId = cid;
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador del carrito invalido");
      } else {
        const cart = await cartModel.findOne({ _id : cartId }).populate('products.productId');
        if (cart) {
          return(cart);
        } else {
          res.status(404).send('Carrito no encontrado');
        }
      }
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
},

// Actualizar un carrito
actualizarCarrito : async  (newcart,cid) =>
{
  try {
    const cartId = cid;
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador del carrito invalido");
      } else {

        const cart = await cartModel.findOne({ _id : cartId }).exec();

        if (!cart) {
          res.status(404).send('Carrito no encontrado');
          return;
        }
            cart = newcart;
            await cart.save();
            res.status(201).json(cart);
        }
      
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
},

// Crear un nuevo carrito
 crearCarrito: async (newcart) =>
{
    try {
     
      await newcart.save();
      res.status(201).json(newcart);
    }
     catch (error) {
      res.status(500).send(`Error en el servidor ${error}`);
    }
  },

 
 
// Funciones para productos

// obtener una lista de productos con filtros y paginaciones

obtenerProductos : async  (combinedFilter, options) =>
{
  try {
    const products = await productModel.paginate(combinedFilter, options);

    return (products);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error en el servidor',error });
    console.error(error)
  }
},

// obtener un producto por su ID
obtenerProducto : async (pid) =>
{
  try {
    const productId = pid ;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador de Producto invalido");
      } else {
        const product = await productModel.findOne({ _id: productId}).exec();
        if (product) {
          return (product);
        } else {
          res.status(404).send('Producto no encontrado');
        }
      }
  } catch (error) {
    res.status(500).send(`Error en el servidor ${error}`);
  }
},

// obtener un producto por su codigo

obtenerProductoPorCodigo : async (codigo) =>
{
  try {
  const existingProduct = await productModel.findOne({ code: codigo }).exec();
  return existingProduct
 }
 catch (error) {
  res.status(500).send(`Error en el servidor ${error}`);
  }
},

// Crear un nuevo producto
crearProducto : async (newProduct) =>
{
    try {
      
      const product = new productModel({ ...newProduct});
      await product.save();
  
      res.status(201).json(product);
    } catch (error) {
      res.status(500).send('Error en el servidor');
    }
  },
  

// actualizar un productos
actualizarProducto : async (producto,pid) =>
{
  try {
    const productId = pid;
    const updatedProduct = producto;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador de Producto invalido");
      } else {


    const product = await productModel.findOne({ _id : productId }).exec();

    if (!product) {
      res.status(404).send('Producto no encontrado');
      return;
    }

    await product.save();
    res.status(200).json(product);
  }
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
},

// Eliminar un producto por su ID
eliminarProducto : async (pid) => 
{
  try {
    const productId = pid;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador de Producto invalido");
      } else {

    const product = await productModel.findOne({ _id : productId }).exec();

    if (!product) {
      res.status(404).send('Producto no encontrado');
      return;
    }

    await product.deleteOne({ _id : productId })
    res.status(200).send(`Producto con ID ${productId} eliminado`)
  }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error en el servidor')
  }
},

// Funciones para Manejo de usuarios

obtenerUsuarioPorEmail : async (direccionDeCorreo) =>
{
  try {
    const existingUser = await userModel.findOne({ email: direccionDeCorreo}).exec();
    return existingUser
   }
   catch (error) {
    res.status(500).send(`Error en el servidor ${error}`);
    }

},

crearUsuario : async (nombre,email,pasword) =>
{
  try {
    const user = new userModel({nombre,email,pasword});
    await user.save();

   }
   catch (error) {
    res.status(500).send(`Error en el servidor ${error}`);
    }
}

}

export default managermd
