//LIBRERIAS
import { Router } from "express";
import fs from 'fs';

//CONSTANTES:
const router = Router()
const cart = obtener_carrito_archivo('./files/CART.json')

//FUNCIONES:
function obtener_carrito_archivo(ruta){
    if(!fs.existsSync(ruta)){
        fs.writeFileSync(ruta, '[]')

    }else{
        const cadena_json = fs.readFileSync(ruta, 'utf-8')
        const array_carrito = JSON.parse(cadena_json)
        return array_carrito}
}

function escribir_carrito_archivo(ruta, array_carrito){
    
    const array_json = JSON.stringify(array_carrito, null, 2) //los 2 parametros que le paso aparte del jsron hecho cadena son para que quede mas legible el json
    fs.writeFileSync(ruta, array_json)
}

function agregar_productos_carrito(objeto_carrito, id_prod){
    const array_objeto_carrito = objeto_carrito.products
    const existe_prod_en_carrito = array_objeto_carrito.find(prod => prod.product === id_prod)

    if(existe_prod_en_carrito){
        existe_prod_en_carrito.quantity +=1

    }else{
        array_objeto_carrito.push({product : id_prod, quantity : 1})
        objeto_carrito.products = array_objeto_carrito
    }

    return objeto_carrito
}

//MIDDLEWARE:
router.get('/', (req, resp)=>{
    resp.json(cart)
})

router.post('/', (req, resp)=>{

    const cart_id = 'carrito_preentrega1_' + cart.length
    const data_cart = {id : cart_id, products: []}
    cart.push(data_cart)
    escribir_carrito_archivo('./files/CART.json',cart)
    resp.json(cart)
})

router.post('/:cid/products/:pid',(req, resp)=>{
    const { cid, pid} = req.params 
    const pid_cast = parseInt(pid)
    const productos_DB = obtener_carrito_archivo('./files/DB.json')
    const carrito_db = obtener_carrito_archivo('./files/CART.json')
    const existe_prod_en_db = productos_DB.some(producto => producto.id === pid_cast)
    const carrito_select = carrito_db.find(carrito => carrito.id === cid)

    if(existe_prod_en_db && carrito_select !== undefined){
        const nuevo_carrito_select = agregar_productos_carrito(carrito_select, pid_cast)
        const index_carrito_select = cart.findIndex(carrito => carrito.id === cid)
        cart[index_carrito_select] = nuevo_carrito_select
        escribir_carrito_archivo('./files/CART.json', cart)
        resp.json({ message : "producto agregado al carrito."})

    }else{
        resp.json({ ERROR_400 : 'Bad params request'})
    }
})

export default router;