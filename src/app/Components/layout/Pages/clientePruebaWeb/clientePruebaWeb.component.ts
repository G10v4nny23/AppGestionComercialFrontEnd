import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalClienteWebComponent } from '../../Modales/modal-clienteWeb/modal-clienteWeb.component';
import { ClienteWebService } from 'src/app/Services/clienteWeb.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';
import { ClienteWeb } from 'src/app/Interfaces/clienteWeb';

@Component({
  selector: 'app-clientePruebaWeb',
  templateUrl: './clientePruebaWeb.component.html',
  styleUrls: ['./clientePruebaWeb.component.css'],
})
export class ClientePruebaWebComponent implements OnInit, AfterViewInit {
  columnasTabla: string[] = [
    'rutCliente',
    'nombreCliente',
    'apellidoCliente',
    'correoCliente',
    'fonoCliente',
    'acciones'
  ];
  dataInicio: ClienteWeb[] = [];
  dataListaCliente = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _clienteServicio: ClienteWebService,
    private _utilidadServicio: UtilidadService
  ) {}

  obtenerClientes() {
    this._clienteServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          console.log(data.status)
          this.dataListaCliente.data = data.value;
          
        } else {
          console.log(data.status);
          this._utilidadServicio.mostrarAlerta('No se encontraron datos', 'Error');
        }
      },
      error: (e) => {},
    });
  }



  ngOnInit(): void {
    this.obtenerClientes();
  }

  ngAfterViewInit(): void {
    this.dataListaCliente.paginator = this.paginacionTabla;
  }

  nuevoCliente() {
    this.dialog.open(ModalClienteWebComponent, {
      disableClose: true,
    }).afterClosed().subscribe(resultado => {
      if (resultado === 'true') this.obtenerClientes();
    });
  }

  editarCliente(cliente: ClienteWeb) {
    this.dialog.open(ModalClienteWebComponent, {
      disableClose: true,
      data: cliente,
    }).afterClosed().subscribe(resultado => {
      if (resultado === 'true') this.obtenerClientes();
    });
  }

  eliminarCliente(cliente: ClienteWeb) {
    Swal.fire({
      title: 'Desea eliminar al cliente?',
      text: cliente.nombreCliente,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver',
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._clienteServicio.eliminar(cliente.rutCliente).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta('El cliente fue eliminado', 'Exito');
              this.obtenerClientes();
            } else {
              this._utilidadServicio.mostrarAlerta('El cliente no pudo ser eliminado', 'Error');
            }
          },
          error: (e) => {},
        });
      }
    });
  }
}
