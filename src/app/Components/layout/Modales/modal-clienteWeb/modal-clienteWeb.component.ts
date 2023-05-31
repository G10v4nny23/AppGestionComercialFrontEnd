import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { ClienteWeb } from 'src/app/Interfaces/clienteWeb';
import { ClienteWebService } from 'src/app/Services/clienteWeb.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

export const MY_DATA_FORMATS = {
  parse:{
    dateInput:'DD/MM/YYYY'
  },
  display:{
    dateInput:'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  }
}


@Component({
  selector: 'app-modal-clienteWeb',
  templateUrl: './modal-clienteWeb.component.html',
  styleUrls: ['./modal-clienteWeb.component.css'],
  providers: [
    {provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS}
  ]
})
export class ModalClienteWebComponent implements OnInit {
  formularioCliente: FormGroup;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';

  constructor(
    private modalActual: MatDialogRef<ModalClienteWebComponent>,
    @Inject(MAT_DIALOG_DATA) public datosCliente: ClienteWeb,
    private fb: FormBuilder,
    private _clienteWebService: ClienteWebService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioCliente = this.fb.group({
      idCliente: [ this.datosCliente?.idCliente || '', Validators.required],
      nombreCliente: ['', Validators.required],
      fechaRegistroCliente: ['', Validators.required],
      fechaPagoCliente: ['', Validators.required],
      telefono:[''],
      correo:[''],
      rut:['']
    });
    if(this.datosCliente != null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }  
  }
  ngOnInit():void {
    if(this.datosCliente != null){
      this.formularioCliente.patchValue({
        idCliente: this.datosCliente.idCliente,
        nombreCliente: this.datosCliente.nombreCliente.toString(),
        fechaRegistroCliente: this.datosCliente.fechaRegistroCliente,
        fechaPagoCliente: this.datosCliente.fechaPagoCliente
      });
    }

  }

  guardarEditar_Cliente() {
    const cliente: ClienteWeb = {
      idCliente: this.formularioCliente.get('idCliente')?.value,
      nombreCliente: this.formularioCliente.get('nombreCliente')?.value.toString(),
      fechaRegistroCliente: new Date(this.formularioCliente.get('fechaRegistroCliente')?.value),
      fechaPagoCliente: new Date(this.formularioCliente.get('fechaPagoCliente')?.value),
      correo: this.formularioCliente.get('correo')?.value,
      rut: this.formularioCliente.get('rut')?.value,
      telefono: this.formularioCliente.get('telefono')?.value
    };
  
    const claveLocalStorage = `adicionales${cliente.nombreCliente}`; // Utiliza el campo 'rut' como parte de la clave
  
    if (this.datosCliente == null) {
      // Guardar cliente en la tabla clienteWeb
      this._clienteWebService.guardar(cliente).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta("El cliente se registró correctamente", "Exito");
            this.modalActual.close("true");
  
            // Guardar datos adicionales en el localStorage
            const datosAdicionales = {
              rut: cliente.rut,
              correo: cliente.correo,
              telefono: cliente.telefono,
              nombre: cliente.nombreCliente
            };
            localStorage.setItem(claveLocalStorage, JSON.stringify(datosAdicionales));
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo registrar el cliente", "Error");
          }
        },
        error: (e) => {}
      });
    } else {
      // Editar cliente en la tabla clienteWeb
      this._clienteWebService.editar(cliente).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta("Cliente editado correctamente", "Exito");
            this.modalActual.close("true");
  
            // Actualizar datos adicionales en el localStorage
            const datosAdicionales = {
              rut: cliente.rut,
              correo: cliente.correo,
              telefono: cliente.telefono
            };
            localStorage.setItem(claveLocalStorage, JSON.stringify(datosAdicionales));
          } else {
            this._utilidadServicio.mostrarAlerta("El cliente no se pudo editar", "Error");
          }
        },
        error: (e) => {}
      });
    }
  }
  
  
}
