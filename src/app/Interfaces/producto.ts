export interface Producto {
    idProducto:number,
    nombreProducto:string,
    idCategoria:number,
    descripcionCategoria:string,
    stock:number,
    precio:string,
    esActivoProducto:number
    precioCompra?:number
}
