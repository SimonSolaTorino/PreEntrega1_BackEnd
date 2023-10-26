import fs from 'fs';

/*CREO LA CLASE ProductManager */
class ProductManager {
    #products
    #array_de_code
    #id

    constructor(path){
        this.#products = []
        this.#array_de_code = []
        this.#id = 1
        this.path = path
    }

    loadCodeArray(last_code){//cada vez que se carga un producto agrega la propiedad code al array
        this.#array_de_code.push(last_code)
    }

    addProduct(title, price, description, thumbnail, code, stock) {
        if (!title || !price || !description || !thumbnail || !code || !stock) {
            console.log("ERROR: uno de los campos está vacío.");
        } else {
            if (!this.#array_de_code.includes(code)) {
                const newProduct = {
                    id: this.#id,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                }
                this.#id += 1;
                this.#products.push(newProduct)
                this.loadCodeArray(code)
                this.cargarArchivo()

            } else {
                console.log(`ERROR: el código ${code} ya existe.`)

            }
        }
    }

    getProducts(){
        if(!fs.existsSync(this.path)){
            return console.log("No se encontraron productos en la base de datos")

        }else{
            try{
                const cadena_json = fs.readFileSync(this.path, 'utf-8')
                const new_array_products = JSON.parse(cadena_json)
                //return console.table(new_array_products) comentado para usarlo en el desafio 3
                return new_array_products

            } catch(error){
                return console.log(`ERROR: ${error} ocurrio al acceder a la base de datos.`)

            }
        }
        
    }

    getProductById(num_id){
        if(!fs.existsSync(this.path)){
            return console.log('ERROR: No existe la base de datos')

        }else{
            try{
                const cadena_json = fs.readFileSync(this.path, 'utf-8')
                const array_productos = JSON.parse(cadena_json)
                const producto_seleccionado = array_productos.find(objeto_productos => objeto_productos.id === num_id)
                if(producto_seleccionado === undefined){
                    const mensaje_error = 'ERROR 404: Product not found.'
                    return mensaje_error

                }
                else{
                    //return console.log(producto_seleccionado) comentado para usarlo en el desafio 3
                    return producto_seleccionado

                }

            }catch(error){
                return console.log(`ERROR: ${error} ocurrio al acceder a la base de datos.`)

            }
        }
    }

    updateProduct(id_prod, info_update, campo){
        if(!fs.existsSync(this.path)){
            return console.log('ERROR: No existe la base de datos')

        }else{
            try{
                const cadena_json = fs.readFileSync(this.path, 'utf-8')
                const array_productos = JSON.parse(cadena_json)
                const producto_seleccionado = array_productos.find(objeto_productos => objeto_productos.id === id_prod)
                if(producto_seleccionado === undefined){
                   return console.log(`ERROR: no se encontro ningun producto con el id ${id_prod}.`)

                }
                else{
                    if(producto_seleccionado.hasOwnProperty(campo)){
                        producto_seleccionado[campo] = info_update
                        const array_json_actualizado = JSON.stringify(array_productos, null, 2)
                        fs.writeFileSync(this.path, array_json_actualizado)
                        return console.log("Se actualizo el producto correctamente.")

                    }else{
                        return console.log(`ERROR: el producto de id: ${id_prod} no cuenta con la propiedad ${campo}.`)

                    }
                }

            }catch(error){
                return console.log(`ERROR: ${error} ocurrio al acceder a la base de datos.`)

            }

        }
    }

    deleteProduct(id_prod){
        if(!fs.existsSync(this.path)){
            return console.log(`ERROR: No se encontro ningun producto con el id ${id_prod} en la base de datos.`)
        }else{
            try{
                const cadena_json = fs.readFileSync(this.path, 'utf-8')
                const array_productos = JSON.parse(cadena_json)
                const producto_seleccionado = array_productos.find(objeto_productos => objeto_productos.id === id_prod)
                if(producto_seleccionado === undefined){
                    return console.log(`ERROR: no se encontro ningun producto con el id ${id_prod}.`)

                 }else{
                    const nuevo_array = array_productos.filter(objeto_productos => objeto_productos.id !== id_prod)
                    const nuevo_array_json = JSON.stringify(nuevo_array, null, 2)
                    fs.writeFileSync(this.path, nuevo_array_json)
                    this.#products = this.#products.filter(objeto_productos => objeto_productos.id !== id_prod)
                    return console.log("Producto borrado correctamente de la base de datos")

                 }
            }catch(error){
                return console.log(`ERROR: ${error} ocurrio al acceder a la base de datos.`)

            }
        }
    }
    
    cargarArchivo(){
        if(!fs.existsSync(this.path)){
            fs.writeFileSync(this.path, '[]')

        }else{
            const array_json = JSON.stringify(this.#products, null, 2) //los 2 parametros que le paso aparte del jsron hecho cadena son para que quede mas legible el json
            fs.writeFileSync(this.path, array_json)

        }
    }
}

export default ProductManager;
/*INSTANCIO LA CLASE
const control_productos = new ProductManager('./Base de Datos/DB.json')

CREO UN PAR DE OBJETOS CON LA CLASE Y SU INSTANCIA
control_productos.addProduct("F!NE BEAUTY", "Sabor tropical fruits", 10.99, "imagen_beauty.jpg", "FNBT01", 100)
control_productos.addProduct("F!NE POWER", "Sabor red fruits", 19.99, "imagen_power.jpg", "FNPW02", 50)
control_productos.addProduct("F!NE SMOOTH", "Sabor blueberrys", 14.99, "imagen_smooth.jpg", "FNSM03", 75)
control_productos.addProduct("F!NE PEAK", "Sabor ", 14.99, "imagen_peak.jpg", "FNPK04", 25)

/*PRUEBO QUE FUNCIONE EL METODO getProducts()
control_productos.getProducts()

PRUEBO QUE FUNCIONE EL METODO getProductById()
control_productos.getProductById(2) //caso que si existe el id
control_productos.getProductById(9999) //caso que no existe el id

PRUEBO QUE FUNCIONE EL METODO updateProduct()
control_productos.updateProduct(1, "producto nuevo","title") //caso de carga correcta
control_productos.updateProduct(1, "no se va a ctualizar", "estilo") //caso de carga incorrecta el campo no existe
control_productos.updateProduct(5, "producto dummy", "title") //caso de carga incorrecta el id no existe

COMPRUEBO QUE SE HAYA ACTUALIZADO EL PRODUCTO
control_productos.getProductById(1)

PRUEBO QUE FUNCIONE EL METODO deleteProduct()
control_productos.deleteProduct(3) //caso de que si existe el producto a eliminar
control_productos.deleteProduct(99) //caso de que no existe el producto a eliminar

COMPRUEBO QUE SE HAYA ELIMINADO EL PRODUCTO DE LA DB
control_productos.getProducts()

OTRAS PRUEBAS
control_productos.addProduct("Producto 4", "ESTE PRODUCTO LO AGREGO PARA VER QUE ONDA EL INDEX DE ID", 14.99, "imagen3.jpg", "P4", 75)
control_productos.getProducts()*/