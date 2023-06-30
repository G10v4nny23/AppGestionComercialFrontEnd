import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrdenCompra } from '../Interfaces/orden-compra';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class OrdenCompraService {


  constructor(){}

  // Agregar datos al localStorage
// Agregar datos al localStorage
addData(key: string, data: any) {
  const existingData = localStorage.getItem(key);
  const parsedData = existingData ? JSON.parse(existingData) : [];
  parsedData.push(data);
  localStorage.setItem(key, JSON.stringify(parsedData));
}

// Obtener datos del localStorage
getData(key: string): any {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}
}
