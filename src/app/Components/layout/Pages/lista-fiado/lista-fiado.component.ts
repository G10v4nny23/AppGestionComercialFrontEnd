import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { Reporte } from 'src/app/Interfaces/reporte';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { Cliente } from 'src/app/Interfaces/cliente';

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
  selector: 'app-lista-fiado',
  templateUrl: './lista-fiado.component.html',
  styleUrls: ['./lista-fiado.component.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }],
})
export class ListaFiadoComponent implements OnInit {
  formularioFiltro: FormGroup;
  clienteRegistro: Cliente[] = [];
  listaVentasReporte: Reporte[] = [];
  columnasTabla: string[] = [
    'fechaRegistro',
    'numeroVenta',
    'tipoPago',
    'total',
    'producto',
    'cantidad',
    'precio',
    'totalProducto'
  ];
  dataVentaReporte = new MatTableDataSource(this.listaVentasReporte);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private _ventaServicio: VentaService,
    private _utilidad: UtilidadService
  ) {
    this.formularioFiltro = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });
  }

  ngOnInit() {
    const clientesData = localStorage.getItem('clientes');
    if(clientesData){
      this.clienteRegistro = JSON.parse(clientesData)
    }
  }

  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla;
  }

  buscarVentas() {
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format(
      'DD/MM/YYYY'
    );
    const _fechaFin = moment(this.formularioFiltro.value.fechaFin).format(
      'DD/MM/YYYY'
    );
    if (_fechaInicio === 'Invalid date' || _fechaFin === 'Invalid date') {
      this._utilidad.mostrarAlerta('Debe ingresar ambas fechas', 'Oops!');
      return;
    }

    this._ventaServicio.reporte(_fechaInicio, _fechaFin).subscribe({
      next: (data) => {
        if (data.status) {
          this.listaVentasReporte = data.value;
          this.dataVentaReporte.data = data.value;
        } else {
          this.listaVentasReporte = [];
          this.dataVentaReporte.data = [];
          this._utilidad.mostrarAlerta('No se encontraron datos', 'Oops!');
        }
      },
      error: (e) => {},
    });
  }
}
