import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { VistaFiados } from '../Interfaces/vista-fiados';




@Injectable({
  providedIn: 'root'
})
export class ServicioFiadoService {

  private urlAPI:string = environment.endpoint + "ListaFiados/";

  constructor(private http:HttpClient) { }

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlAPI}Lista`)
  }

  
  editar(fiado: VistaFiados): Observable<ResponseApi> {
    const url = `${this.urlAPI}Editar`;

    return this.http.put<ResponseApi>(url, fiado);
  }

  cambiarEstado(fiado: VistaFiados): Observable<ResponseApi> {
    const url = `${this.urlAPI}CambiarEstado`;

    return this.http.put<ResponseApi>(url, fiado);
  }







}
