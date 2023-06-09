import { Component,OnInit } from '@angular/core';

import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

import { Producto } from 'src/app/Interfaces/producto';
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { ClienteWebService } from 'src/app/Services/clienteWeb.service';
import { Usuario } from 'src/app/Interfaces/usuario';
import { validate } from 'uuid';
import { ClienteWeb } from 'src/app/Interfaces/clienteWeb';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  listaProductos:Producto[] = [];
  listaProductosFiltro:Producto[] = [];
  dataListaCliente:ClienteWeb[] = [];
  

  listaProductosParaVenta:DetalleVenta[] = [];
  bloquearBotonRegistrar:boolean = false;

  userId : any;
  userName:any;
  fechaActual = new Date();


  productoSeleccionado!: Producto;
  tipodePagoPorDefecto: string = "Efectivo";
  totalPagar: number = 0;
  rutSeleccionado: ClienteWeb;

  formularioProductoVenta: FormGroup;
  columnasTabla: string[]=['producto','cantidad','rut','precio','total','accion'];
  datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

  retornarProductosPorFiltro(busqueda:any):Producto[]{
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLocaleLowerCase():busqueda.nombreProducto.toLocaleLowerCase();

    return this.listaProductos.filter(item => item.nombreProducto?.toLocaleLowerCase().includes(valorBuscado));
  }

  constructor(
    private fb:FormBuilder,
    private _productoServicio: ProductoService,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService,
    private _clienteServicio: ClienteWebService,
  ){
    this.formularioProductoVenta = this.fb.group({
      producto:['',Validators.required],
      cantidad:['',Validators.required],
      rut:['',Validators.required],
    });


    

    this._productoServicio.lista().subscribe({
      next:(data)=> {
        if(data.status){
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(p => p.esActivoProducto == 1 && p.stock > 0);
        }
      },
      error:(e)=>{}
    })

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
      this.listaProductosFiltro = this.retornarProductosPorFiltro(value);
    })


    //codigo para obtener la ID del Usuario en el Local Storage
  const usuarioString = localStorage.getItem('usuario');
  if (usuarioString) {
    const usuario = JSON.parse(usuarioString);
    this.userId = usuario.idUsuario;
    this.userName = usuario.nombreCompleto;
  }

  }

  ngOnInit(): void {

    this.obtenerClientes();
  }

  mostrarProducto(producto: Producto):string{
    return producto.nombreProducto;
  }

  mostrarRut(rut: ClienteWeb):string{
    return rut.rutCliente;
  }

  productoParaVenta(event:any){
    this.productoSeleccionado = event.option.value;
  }

  rutParaVenta(event:any){
    this.rutSeleccionado = event.option.value;
  }

  agregarProductoParaVenta(){

    const _cantidad: number = this.formularioProductoVenta.value.cantidad;
    const _precio: number = parseFloat(this.productoSeleccionado.precio);
    const _total: number = _cantidad * _precio;
    this.totalPagar = this.totalPagar + _total;

    console.log(this.formularioProductoVenta.value.rut);
    this.listaProductosParaVenta.push({
      idProducto : this.productoSeleccionado.idProducto,
      rut:this.formularioProductoVenta.value.rut.rutCliente,
      descripcionProducto : this.productoSeleccionado.nombreProducto,
      cantidad: _cantidad,
      precioTexto: parseFloat(_precio.toFixed(2)),
      totalTexto: parseFloat(_total.toFixed(2))
    })
    

    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

    this.formularioProductoVenta.patchValue({
      producto:'',
      cantidad:'',
    })
  }

  eliminarProducto(detalle: DetalleVenta){
    this.totalPagar = this.totalPagar - (detalle.totalTexto),
    this.listaProductosParaVenta = this.listaProductosParaVenta.filter(p => p.idProducto != detalle.idProducto);

    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
  }

  registrarVenta() {

   
   
    if (this.listaProductosParaVenta.length > 0) {
      this.bloquearBotonRegistrar = true;
  
      const request: Venta = {
        tipoPago: this.tipodePagoPorDefecto,
        totalTexto: String(this.totalPagar),
        detalleVenta: this.listaProductosParaVenta,
        rutCliente: this.rutSeleccionado.rutCliente,
        idUsuario: this.userId,
      };
  
      this._ventaServicio.registrar(request).subscribe({
        next: (response) => {
          if (response.status) {
            this.generarBoleta(this.tipodePagoPorDefecto,this.totalPagar, response.value.numeroDocumento);
            this.totalPagar = 0;
            this.listaProductosParaVenta = [];
            this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
  
            Swal.fire({
              icon: 'success',
              title: 'Venta Registrada!',
              text: `Numero de venta: ${response.value.numeroDocumento}`
            }).then(() => {
              // Llama al método generarBoleta() con los datos de la venta
              
            });
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo registrar la venta", "Oops");
          }
        },
        complete: () => {
          this.bloquearBotonRegistrar = false;
          
        },
        error: (e) => {}
      });
    }
  }
  

  generarBoleta(tipoPago:string, totalTexto:number, numeroVenta:string){

    const doc = new jsPDF({
      format:[100,150],//tamaño en mm
      unit:'mm'
    });

    //contenido de la boleta
    doc.text('######################',10,20);
    doc.text('Boleta de Venta',10,30);
    doc.text('######################',10,40);

    //datos de la venta
    doc.text(`Tipo de Pago: ${tipoPago}`,10,50);
    doc.text(`Total a Pagar: ${totalTexto}`,10,60);
    doc.text(`Número de Venta: ${numeroVenta}`,10,70);

    //guardar el pdf
    const nombrePDF = `boleta_venta_${numeroVenta}.pdf`
    doc.save(nombrePDF)

  }

  obtenerClientes() {
    this._clienteServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          console.log(data.status)
          this.dataListaCliente = data.value;
          console.log(this.dataListaCliente);
          
        } else {
          console.log(data.status);
          this._utilidadServicio.mostrarAlerta('No se encontraron datos', 'Error');
        }
      },
      error: (e) => {},
    });
  }

}
