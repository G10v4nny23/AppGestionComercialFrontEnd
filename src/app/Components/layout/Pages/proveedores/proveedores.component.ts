import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Proveedor } from 'src/app/Interfaces/proveedor';
import { ProductoProveedor } from 'src/app/Interfaces/productoProveedor';
import jsPDF from 'jspdf';
import { nanoid } from 'nanoid';






@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

 //lista vacía de proveedores
 proveedores: Proveedor[] = [];
 dataSource: MatTableDataSource<Proveedor>;
 displayedColumns: string[]= ['nombre', 'telefono', 'correo','productos','cantidades', 'acciones'];


  constructor() {
    this.dataSource = new MatTableDataSource(this.proveedores)
  }


  //funciones para los proveedores

  agregarListaProveedor(){
    const nuevoProveedor:Proveedor={
      idOrden: nanoid(),
      nombre:'',
      telefono:'',
      correo:'',
      productosProveedor: [],
    };
    this.proveedores.push(nuevoProveedor);
    this.dataSource.data = this.proveedores;
  }
  
  agregarProducto(proveedor:Proveedor){
    const nuevoProducto: ProductoProveedor={
      nombre: '',
      cantidad: 0
    }
    proveedor.productosProveedor.push(nuevoProducto)
  }

  
  eliminarProveedor(index:number){
    this.proveedores.splice(index, 1);
    this.dataSource.data = this.proveedores;
    this.guardarProveedoresLS();
  }


  guardarProveedoresLS(){
    localStorage.setItem('proveedores', JSON.stringify(this.proveedores))
  }


  ngOnInit() {
    const savedProveedores = localStorage.getItem('proveedores');
    if(savedProveedores){
      this.proveedores = JSON.parse(savedProveedores)
      this.dataSource.data = this.proveedores
    }
  }



  //generamos la orden de compra en PDF


  generarOrdenCompra(proveedor: Proveedor) {
  // Crear una nueva instancia de jsPDF
  const doc = new jsPDF();

  // Definir el contenido del PDF
  doc.setFontSize(18);
  doc.text('Orden de Compra', 10, 10);
  doc.setFontSize(12);
  doc.text(`Identificador de Orden de Compra: ${proveedor.idOrden}`, 10, 20);
  doc.text(`Proveedor: ${proveedor.nombre}`, 10, 30);
  doc.text(`Correo: ${proveedor.correo}`, 10, 40);
  doc.text(`Teléfono: ${proveedor.telefono}`, 10, 50);
  doc.setFontSize(14);
  doc.text('Productos:', 10, 60);

  const listadoProductos = this.generarListadoProductos(proveedor);
  listadoProductos.forEach((item, index) => {
    doc.text(item, 10, 70 + index * 10);
  });

  // Guardar o visualizar el PDF
  doc.save('orden_compra.pdf');
}

generarListadoProductos(proveedor:Proveedor): string[]{
  const listadoProductos: string[] = [];
  proveedor.productosProveedor.forEach((productoProveedor)=>{
    const item = `${productoProveedor.nombre} - ${productoProveedor.cantidad}`;
    listadoProductos.push(item)
  })
  return listadoProductos;
}

  
}
