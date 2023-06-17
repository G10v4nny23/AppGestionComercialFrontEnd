import { Producto } from "./producto";

export interface Proveedor {
    rutProveedor: string
    nombreProveedor: string;
    correoProveedor: string;
    telefonoProveedor: string;
    productos?:Producto[]
}
