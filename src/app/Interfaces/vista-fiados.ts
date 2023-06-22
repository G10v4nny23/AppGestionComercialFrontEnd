export interface VistaFiados {
    idVenta:number,
    idUsuario:number,
    rutCliente:string,
    numeroDocumento: number,
    total:number,
    fechaVenta:string
    fechaPago?:string
    esPagada: boolean
};
