import { ProductoProveedor } from "./productoProveedor";

export interface Proveedor {
    idOrden: string;
    nombre: string;
    telefono: string;
    correo: string;
    productosProveedor: ProductoProveedor[] 
}
