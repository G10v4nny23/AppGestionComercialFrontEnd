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

  guardarEditar_Cliente(){
    const _cliente: ClienteWeb = {
      idCliente: 0,
      nombreCliente: this.formularioCliente.get('nombreCliente')?.value.toString(),
      fechaRegistroCliente: new Date(this.formularioCliente.get('fechaRegistroCliente')?.value),
      fechaPagoCliente: new Date(this.formularioCliente.get('fechaPagoCliente')?.value)      
    }

    if(this.datosCliente == null){
      this._clienteWebService.guardar(_cliente).subscribe({
        next:(data)=>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El cliente se registró correctamente","Exito");
            this.modalActual.close("true")
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo registrar el cliente", "Error")
          }
        },
        error:(e)=>{}
      })
    }else{
      this._clienteWebService.editar(_cliente).subscribe({
        next:(data)=>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("Cliente editado correctamente", "Exito")
            this.modalActual.close("true")
          }else{
            this._utilidadServicio.mostrarAlerta("El cliente no se pudo editar", "Error")
          }
        },
        error:(e)=>{}
      })
    }


  }
}
