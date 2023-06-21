import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs'
import { environment } from 'src/environments/environment';
import { Transbank } from '../Interfaces/transbank';
import { TransbankResponse } from '../Interfaces/transbank-response';
import { TransbankConfirm } from '../Interfaces/transbank-confirm';


@Injectable({
  providedIn: 'root'
})
export class TransbankService {

  private urlApi:string =  `${environment.endpoint}Transbank`

  constructor(private http:HttpClient) { }

  crearTransaccion(payload:Transbank):Observable<TransbankResponse>{
    return this.http.post<TransbankResponse>(this.urlApi+'/crearTransaccion', payload)
  }

  confirmarTransaccion(token:string):Observable<TransbankConfirm>{
    return this.http.get<TransbankConfirm>(`${this.urlApi}/confirmarTransaccion/${token}`)
  }

  

}
