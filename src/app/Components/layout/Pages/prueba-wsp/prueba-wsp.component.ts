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
import { TransbankService } from 'src/app/Services/transbank.service';
import { Transbank } from 'src/app/Interfaces/transbank';
import { nanoid } from 'nanoid';

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
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }],
})
export class PruebaWSPComponent implements OnInit {
  dataSource: MatTableDataSource<VistaFiados> = new MatTableDataSource();
  displayedColumns: string[] = [
    'idVenta',
    'idUsuario',
    'rutCliente',
    'numeroDocumento',
    'total',
    'fechaVenta',
    'estado',
    'fechaPago',
    'actions',
  ];

  selectedRow: any;
  currentDate: Date;
  formattedDate: string;
  listadoClientes: ClienteWeb[] = [];
  message: string;
  phoneNumber: string;

  constructor(
    private servicioFiado: ServicioFiadoService,
    private utilidad: UtilidadService,
    private clienteService: ClienteWebService,
    private http: HttpClient,
    private transbank: TransbankService
  ) {
    this.currentDate = new Date();
    this.formattedDate = moment(this.currentDate).format('DD/MM/YYYY');
    this.message = `Estimado Cliente, le informamos que su boleta fue registrada. Para pagar, lo puede hacer presencialmente o en el siguiente link: [LINK] Gracias por preferirnos`;
    this.phoneNumber = '';
  }

  ngOnInit(): void {
    this.obtenerDatosTabla();
    this.listarCliente()
  }

  sendWhatsAppMessage(row: any) {
    const payloadTB: Transbank = {
      amount: row.total,
      buyOrder: nanoid(),
      sessionId: nanoid(),
      returnUrl: 'http://localhost:4200/pages/confirmacionTB',
    };

    this.transbank.crearTransaccion(payloadTB).subscribe((response) => {

      console.log(row)
      const rutCliente = row.rutCliente;
      console.log(rutCliente);
      const clienteEncontrado = this.listadoClientes.find((cliente) => cliente.rutCliente === rutCliente);
      const phoneNumber = clienteEncontrado.fonoCliente;
      console.log(phoneNumber)
      const formattedNumber = phoneNumber.substring(1); // "569"

      console.log(formattedNumber);

      const payload = {
        message: this.message.replace(/\[LINK\]/g, response.url),
        phone: formattedNumber,
      };

      const URLApi = 'http://localhost:3001/lead';

      this.http.post(URLApi, payload).subscribe(
        () => {
          this.utilidad.mostrarAlerta('Mensaje Enviado!', 'Listo!');
        },
        (error) => {
          this.utilidad.mostrarAlerta('Mensaje no ha sido enviado', 'Oops!');
        }
      );
    });
  }

  listarCliente() {
    this.clienteService.lista().subscribe({
      next: (data) => {
        if (data.status) this.listadoClientes = data.value;
        console.log(this.listadoClientes);
      },
    });
  }

  obtenerDatosTabla() {
    this.servicioFiado.lista().subscribe({
      next: (data) => {
        if (data.status) {
          const formattedData = data.value.map((item: VistaFiados) => {
            return {
              ...item,
              fechaVenta: moment(item.fechaVenta).format('DD/MM/YYYY'), // Formatear la fecha de venta
              fechaPago: item.fechaPago
                ? moment(item.fechaPago).format('DD/MM/YYYY')
                : '', // Formatear la fecha de pago solo si no es nula
            };
          });
          this.dataSource = new MatTableDataSource<VistaFiados>(formattedData);
        } else {
          this.utilidad.mostrarAlerta('No se encontraron fiados', 'Oops!');
        }
      },
    });
  }

  editarFecha(row: VistaFiados, event: any) {
    const newDate = moment(event.value).format('YYYY-MM-DDTHH:mm:ss');
    row.fechaPago = newDate;

    this.servicioFiado.cambiarEstado(row).subscribe((response: ResponseApi) => {
      if (response.status) {
        this.utilidad.mostrarAlerta('Fecha de pago actualizada', 'Ok!');
      } else {
        this.utilidad.mostrarAlerta(
          'Error al editar la fecha de pago',
          'Damn :('
        );
      }
    });
  }

  cambiarEstado(row: VistaFiados) {
    row.pagado = true;

    this.servicioFiado.editar(row).subscribe((response: ResponseApi) => {
      if (response.status) {
        this.utilidad.mostrarAlerta('Fiado Pagado!', 'Bien!');
        this.obtenerDatosTabla(); // Actualizar la tabla después de cambiar el estado
      } else {
        this.utilidad.mostrarAlerta('El fiado no se pudo pagar', ':(');
      }
    });
  }
}
