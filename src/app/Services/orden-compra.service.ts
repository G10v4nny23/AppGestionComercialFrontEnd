import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdenCompraService {
  private apiUrl = 'http://localhost:8088'


  constructor(private http:HttpClient) { }


  agregarOrdenCompra(rutProveedor:any){
    return this.http.post<any>(`${this.apiUrl}/agregarOrdenCompra/`, rutProveedor)
  }


  //agregar un detalle orden compra -> idProducto, cantidad, stock
  detalleOrdenCompra(detalle:any){
    return  this.http.post<any>(`${this.apiUrl}/detalleOrdenCompra/`, detalle)
  }

  
// Ruta para obtener una orden de compra por su RUT de proveedor
  ordenCompraPorProveedor(rutProveedor:string){
    return this.http.get<any[]>(`${this.apiUrl}/ordenCompraPorProveedor/:${rutProveedor}/`)
  }

  obtenerDetalleOC(rutProveedor:string){
    return this.http.get<any[]>(`${this.apiUrl}/detallesOrdenCompraPorProveedor/:${rutProveedor}`)
  }


}
