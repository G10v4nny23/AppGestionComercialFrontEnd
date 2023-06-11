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
      rutCliente:['',Validators.required],
      nombreCliente:['',Validators.required],
      apellidoCliente:['',Validators.required],
      correoCliente:['',Validators.required],
      fonoCliente:['',Validators.required],
    });
    if(this.datosCliente != null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }  
  }
  ngOnInit():void {
    if(this.datosCliente != null){
      this.formularioCliente.patchValue({
        rutCliente : this.datosCliente.rutCliente,
        nombreCliente : this.datosCliente.nombreCliente,
        apellidoCliente : this.datosCliente.apellidoCliente,
        correoCliente : this.datosCliente.correoCliente,
        fonoCliente : this.datosCliente.fonoCliente,
      });
    }

  }

  guardarEditar_Cliente() {
    const cliente: ClienteWeb = {
      rutCliente: this.formularioCliente.get('rutCliente')?.value,
      nombreCliente: this.formularioCliente.get('nombreCliente')?.value,
      apellidoCliente: this.formularioCliente.get('apellidoCliente')?.value,
      correoCliente: this.formularioCliente.get('correoCliente')?.value,
      fonoCliente: this.formularioCliente.get('fonoCliente')?.value,
  
    };
  
    const claveLocalStorage = `adicionales${cliente.nombreCliente}`; // Utiliza el campo 'rut' como parte de la clave
  
    if (this.datosCliente == null) {
      // Guardar cliente en la tabla clienteWeb
      this._clienteWebService.guardar(cliente).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta("El cliente se registró correctamente", "Exito");
            this.modalActual.close("true");
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
          }
        },
        error: (e) => {}
      });
    }
  }
  
  
}
