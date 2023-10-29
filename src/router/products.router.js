//LIBRERIAS
import { Router } from "express";
import fs from 'fs';

//CONSTANTES:
const router = Router()
const products = obtener_DB_archivo('./files/DB.json')
const propiedades_obligatorias = ['title', 'description', 'category', 'code', 'price', 'stock', 'status', 'thumbnail']

//FUNCIONES:
function validar_ingreso(data) {

    //valido que todas las que el usuario ingrese sean las que necesita tener el json
    for (const propiedad of propiedades_obligatorias) {
        if (!data.hasOwnProperty(propiedad)) {
          return false
        }

        if(propiedad == 'status' && data.status === undefined){
            data.status = true
        }
    }
  
    //valido que el tipo de dato ingresado sea correcto
    if (typeof data.title !== 'string' || typeof data.description !== 'string' || typeof data.category !== 'string' || typeof data.code !== 'string' || typeof data.price !== 'number' || typeof data.stock !== 'number' || typeof data.status !== 'boolean' || !Array.isArray(data.thumbnail)) {
      
        return false
    }

    return true
}

function obtener_DB_archivo(ruta){
    if(!fs.existsSync(ruta)){
        fs.writeFileSync(ruta, '[]')

    }else{
        const cadena_json = fs.readFileSync(ruta, 'utf-8')
        const array_productos = JSON.parse(cadena_json)
        return array_productos}
}

function escribir_DB_archivo(ruta, array_productos){
    const array_json = JSON.stringify(array_productos, null, 2) //los 2 parametros que le paso aparte del jsron hecho cadena son para que quede mas legible el json
    fs.writeFileSync(ruta, array_json)
}

//MIDDLEWARE:
router.get('/', (req, resp)=>{
    resp.json(products)
})

router.post('/', (req, resp)=>{
    const data_postman = req.body

    if(validar_ingreso(data_postman)){
        data_postman.id = products.length +1 //con esta var llevo registro de los id que se van a ir generando para que siempre sean unicos
        products.push(data_postman)
        escribir_DB_archivo('./files/DB.json',products)
        resp.json(data_postman)
    }
    else{
        resp.json({ ERROR_400 : 'Bad params request'})
    }
})

router.put('/:pid',(req, resp)=>{
    let cambios = true
    const { pid } = req.params
    const data_postman = req.body
    const products_db = obtener_DB_archivo('./files/DB.json')
    const prod_select = products_db.find(producto => producto.id === parseInt(pid)) //busco el producto por id

    if(prod_select === undefined){
        resp.json({ ERROR_400 : 'Bad params request'})
    }else{
        for (const key in data_postman) {
            if(prod_select.hasOwnProperty(key)){
                prod_select[key] = data_postman[key]
            }
            else{
                cambios = false
            }
        }

        if(cambios == true){
            const index_prod = products_db.indexOf(prod_select)
            products_db[index_prod] = prod_select
            escribir_DB_archivo('./files/DB.json', products_db)
            resp.json({ Success: 'Producto actualizado exitosamente' })
        }else{
            resp.json({ERROR : "campo/os no existente/es"})
        }
        
    }
})

router.delete('/:pid', (req, resp)=>{
    const { pid } = req.params
    const products_db = obtener_DB_archivo('./files/DB.json')
    const prod_select = products_db.find(producto => producto.id === parseInt(pid)) //busco el producto por id

    if(prod_select === undefined){
        resp.json({ ERROR_400 : 'Bad params request'})
    }else{
        const nuevo_products_db = products_db.filter(objeto_productos => objeto_productos.id !== parseInt(pid))
        escribir_DB_archivo('./files/DB.json', nuevo_products_db)
        resp.json({ Success: 'Producto eliminado exitosamente' })
    }

})

export default router;