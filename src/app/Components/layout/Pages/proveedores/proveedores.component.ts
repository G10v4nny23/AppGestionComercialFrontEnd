import { AfterViewInit, Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { Producto } from 'src/app/Interfaces/producto';
import { ProductoProveedor } from 'src/app/Interfaces/productoProveedor';
import { Proveedor } from 'src/app/Interfaces/proveedor';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { ProveedorService } from 'src/app/Services/proveedor.service';
import { v4 as uuid4 } from 'uuid';
import { MatTabGroup } from '@angular/material/tabs';
import { nanoid } from 'nanoid';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit{
 

  ordenCompra: any = {
    rutProveedor: '',
    idProducto: '',
    cantidad: ''
  }

  ordenCompraForm:FormGroup;

  tabActiva = 0;

  proveedor: Proveedor = {
    rutProveedor: '',
    nombreProveedor: '',
    correoProveedor: '',
    telefonoProveedor: ''
    
  };

  proveedores: Proveedor[] = [];

  displayedColumns: string[]=['rutProveedor', 'nombreProveedor','correoProveedor','telefonoProveedor','acciones']
  matTabGroup: any;

  constructor(private proveedorService:ProveedorService,
    private utilidad:UtilidadService,
    private router:Router,
    private fb:FormBuilder, 
    private productoServicio:ProductoService
) {

      this.ordenCompraForm = this.fb.group({
        rutProveedor:['', Validators.required],
        cantidad:['', Validators.required],
        idProducto:['', Validators.required],
      })
    }



  ngOnInit() {
    this.cargarProveedores();
  }
 
  cambiarTab(pestana: number) {
    this.tabActiva = pestana;
  }

  guardarProveedor(): void {
    this.proveedorService.guardar(this.proveedor).subscribe(
      (response) => {
        if (response.status) {
          this.utilidad.mostrarAlerta("Proveedor Guardado!", "OK!")
          console.log('Proveedor guardado exitosamente');
          // Restablecer los campos del formulario después de guardar los datos
          this.proveedor = {
            rutProveedor: '',
            nombreProveedor: '',
            correoProveedor: '',
            telefonoProveedor: ''
            
          };
        } else {
          console.log('Error al guardar el proveedor', response.msg);
          this.utilidad.mostrarAlerta("No se pudo guardar el proveedor", ":C")
        }
      },
      (error) => {
        console.log('Error en la petición:', error);
      }
    );
  }
  
  cargarProveedores(){
    this.proveedorService.lista().subscribe(
      (response)=>{
        if(response.status){
          this.proveedores = response.value;
          console.log(this.proveedores)
        }else{
          console.log("No hay proveedores o hay un error")
          this.utilidad.mostrarAlerta("Error al obtener la lista de Proveedores",":(")
        }
      },
      (error)=>{
        console.log("Error en la petición", error)
      }
    )
  }

  eliminarProveedor(proveedor:Proveedor):void{
    console.log(proveedor.rutProveedor)
    this.proveedorService.eliminar(proveedor.rutProveedor).subscribe(
      (response)=>{
        if(response.status){
          console.log("Proveedor Eliminado")
          this.cargarProveedores();//se vuelven a cargar proveedores
        }else{
          console.log("ERROR ELIMINAR PROVEEDOR")
        }
      },
      (error)=>{
        console.log("Error en la petición", error)
      }
    )
  }










}
