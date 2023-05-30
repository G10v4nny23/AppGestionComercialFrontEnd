import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs'
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { ClienteWeb } from '../Interfaces/clienteWeb';

@Injectable({
  providedIn: 'root'
})
export class ClienteWebService {

  private urlApi:string = environment.endpoint + "Cliente/"

constructor(private http:HttpClient) { }

lista():Observable<ResponseApi>{
  return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
}
guardar(request: ClienteWeb): Observable<ResponseApi>{
  return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request)
}
editar(request: ClienteWeb): Observable<ResponseApi>{
  return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)
}
eliminar(idCliente:number): Observable<ResponseApi>{
  return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${idCliente}`)
}

}
