import express from 'express';
import routerProducts from './router/products.router.js';
import routerCart from './router/cart.router.js';

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/static', express.static('public'))


app.get('/', (req, resp)=>{resp.send('ok')})

app.use('/api/products', routerProducts) //uso la ruta de productos
app.use('/api/cart', routerCart)  //uso la ruta de carrito


app.listen(8080, ()=>{console.log('Listening....')})