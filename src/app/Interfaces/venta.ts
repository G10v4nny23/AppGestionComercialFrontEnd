import { DetalleVenta } from "./detalle-venta";

export interface Venta {
    idVenta?:number,
    idUsuario: number,
    nombreUsuario?:string,
    rutCliente:string,
    numeroDocumento?:string,
    tipoPago:string,
    fechaRegistro?:string,
    totalTexto:string,
    detalleVenta:DetalleVenta[]
}
