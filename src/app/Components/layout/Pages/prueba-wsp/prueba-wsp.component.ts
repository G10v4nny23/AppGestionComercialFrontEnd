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
import { ClienteWeb } from 'src/app/Interfaces/clienteWeb';
import { ClienteWebService } from 'src/app/Services/clienteWeb.service';
import { MatDialog } from '@angular/material/dialog';



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

  selectedRow:any;
  currentDate: Date;
  formattedDate: string;
  listadoClientes : ClienteWeb[] = []
  message : string;
  phoneNumber: string;

  constructor(
    private servicioFiado: ServicioFiadoService,
    private utilidad: UtilidadService,
    private clienteService: ClienteWebService,
    private http:HttpClient,
    private dialog:MatDialog
  ) {
    this.currentDate = new Date();
    this.formattedDate = moment(this.currentDate).format('DD/MM/YYYY')
    this.message = `Estimado Cliente, le informamos que su boleta fue registrada con fecha ${this.formattedDate}. Gracias por preferirnos`;
    this.phoneNumber = ''
  }

  ngOnInit(): void {
    this.obtenerDatosTabla();
    this.listarCliente();
  }

  sendWhatsAppMessage(row: any) {
    const rutCliente = row.rutCliente;
    const clienteEncontrado = this.listadoClientes.find(cliente => cliente.rutCliente === rutCliente);
    const phoneNumber = clienteEncontrado?.fonoCliente;
    const formattedNumber = phoneNumber?.substring(1); // "569"

  
      const payload = {
        message: this.message,
        phone: formattedNumber
      };
      
      const URLApi = 'http://localhost:3001/lead';
 
      this.http.post(URLApi, payload).subscribe(
        ()=>{
          this.utilidad.mostrarAlerta("Mensaje Enviado!", "Listo!")
        }, error=>{
          this.utilidad.mostrarAlerta("Mensaje no ha sido enviado", "Oops!")
        }
      )

  }
  
  


  listarCliente(){
    this.clienteService.lista().subscribe({
      next:(data)=>{
        if(data.status)
        this.listadoClientes = data.value
        console.log(this.listadoClientes)
      }
    })
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


