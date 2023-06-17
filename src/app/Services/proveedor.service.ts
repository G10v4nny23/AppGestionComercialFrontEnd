import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Proveedor } from '../Interfaces/proveedor';


@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private urlApi:string = environment.endpoint + "Proveedor/";

  constructor(private http:HttpClient) { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }
  guardar(request: Proveedor): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request)
  }
  editar(request: Proveedor): Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)
  }
  eliminar(rutProveedor:string): Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${rutProveedor}`)
  }
}
