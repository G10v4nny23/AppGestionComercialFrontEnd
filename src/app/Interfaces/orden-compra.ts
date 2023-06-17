import { Producto } from "./producto";
import { Proveedor } from "./proveedor";

export interface OrdenCompra {
    proveedor:Proveedor
    productos:Producto[]
}
