import { Component, OnInit, ViewChild } from '@angular/core';
import { VistaFiados } from 'src/app/Interfaces/vista-fiados';
import { ServicioFiadoService } from 'src/app/Services/servicio-fiado.service';
import { MatTableDataSource } from '@angular/material/table';
import { ResponseApi } from 'src/app/Interfaces/response-api';
import * as moment from 'moment';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { urlAlphabet } from 'nanoid';

export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-prueba-wsp',
  templateUrl: './prueba-wsp.component.html',
  styleUrls: ['./prueba-wsp.component.css'],
  providers:[
    {provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS}
  ]
})
export class PruebaWSPComponent implements OnInit {
  dataSource: MatTableDataSource<VistaFiados> = new MatTableDataSource;
  displayedColumns: string[] = [
    'idVenta',
    'idUsuario',
    'rutCliente',
    'numeroDocumento',
    'total',
    'fechaVenta',
    'actions'
  ];


  message : string = 'hola mi chan deposita';
  phoneNumber: string = '56945148418';

  constructor(
    private servicioFiado: ServicioFiadoService,
    private utilidad: UtilidadService,
    private http:HttpClient
  ) {}

  ngOnInit(): void {
    this.obtenerDatosTabla();
  }

  enviarWSP(){
    const URLApi = 'http://localhost:3001/lead';
    const payload = {
      message: this.message,
      phone:this.phoneNumber
    };

    this.http.post(URLApi, payload).subscribe(
      ()=>{
        this.utilidad.mostrarAlerta("Mensaje enviado correctamente.", "Listo!")
      },error =>{
        this.utilidad.mostrarAlerta("Mensaje no ha sido enviado.", "Oops!")
      }
    )
  }

  obtenerDatosTabla() {
    this.servicioFiado.lista().subscribe({
      next: (data) => {
        if (data.status) {
          const formattedData = data.value.map((item: VistaFiados) => {
            return {
              ...item,
              fechaVenta: moment(item.fechaVenta).format('DD/MM/YYYY'), // Formatear la fecha
            };
          });
          this.dataSource = new MatTableDataSource<VistaFiados>(formattedData);
        } else {
          this.utilidad.mostrarAlerta('No se encontraron fiados', 'Oops!');
        }
      },
    });
  }









}


