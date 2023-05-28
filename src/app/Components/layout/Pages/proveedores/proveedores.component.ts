import { AfterViewInit, Component, OnInit} from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import jsPDF from 'jspdf';
import { Producto } from 'src/app/Interfaces/producto';
import { ProductoProveedor } from 'src/app/Interfaces/productoProveedor';
import { Proveedor } from 'src/app/Interfaces/proveedor';
import { ProductoService } from 'src/app/Services/producto.service';
import { v4 as uuid4 } from 'uuid';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit, AfterViewInit {
  proveedores: Proveedor[] = [];
  proveedorSeleccionado: Proveedor | null = null;
  productos: Producto[] = [];
  productosProveedor: ProductoProveedor[] = [];
  proveedor: Proveedor = {
    idOrden: '',
    nombre: '',
    correo: '',
    telefono: '',
    productosProveedor: []
  };

  constructor(private productoServicio: ProductoService) {}

  ngOnInit() {
    this.obtenerProveedores();
    this.obtenerProductos();
  }
  ngAfterViewInit(): void {
    this.obtenerProveedores();
  }




  agregarProveedor() {
    // Obtener los proveedores almacenados en el localStorage
    let proveedores: Proveedor[] = [];
    const proveedoresString = localStorage.getItem('proveedores');
    if (proveedoresString) {
      proveedores = JSON.parse(proveedoresString);
    }

    // Agregar el proveedor actual a la lista
    proveedores.push(this.proveedor);

    // Guardar la lista actualizada en el localStorage
    localStorage.setItem('proveedores', JSON.stringify(proveedores));

    // Reiniciar el formulario después de agregar el proveedor
    this.proveedor = {
      idOrden: '',
      nombre: '',
      telefono: '',
      correo: '',
      productosProveedor: []
    };
  }

  obtenerProveedores() {
    const proveedoresString = localStorage.getItem('proveedores');
    if (proveedoresString) {
      this.proveedores = JSON.parse(proveedoresString);
    }
  }

  obtenerProductos() {
    this.productoServicio.lista().subscribe(response => {
      if (response.status) {
        this.productos = response.value;
        this.productosProveedor = this.productos.map(producto => ({
          nombre: producto.nombreProducto,
          cantidad: 0
        }));
      }
    });
  }

  aumentarCantidad(productoProveedor: ProductoProveedor) {
    productoProveedor.cantidad++;
  }

  disminuirCantidad(productoProveedor: ProductoProveedor) {
    if (productoProveedor.cantidad > 0) {
      productoProveedor.cantidad--;
    }
  }

  seleccionarProveedor(proveedor: Proveedor) {
    this.proveedorSeleccionado = proveedor;
  }

  generarOrdenCompra(proveedor: Proveedor) {

    //creamos variable para orden de compra
    const ordenCompra = uuid4()

    // Crear una nueva instancia de jsPDF
    const doc = new jsPDF();

    // Definir el contenido del PDF
    doc.setFontSize(18);
    doc.text('Orden de Compra', 10, 10);
    doc.setFontSize(12);
    doc.text(`Identificador de Orden de Compra: ${ordenCompra}`, 10, 20);
    doc.text(`Proveedor: ${proveedor.nombre}`, 10, 30);
    doc.text(`Correo: ${proveedor.correo}`, 10, 40);
    doc.text(`Teléfono: ${proveedor.telefono}`, 10, 50);
    doc.setFontSize(14);
    doc.text('Productos:', 10, 60);

    const productosNoCero = this.productosProveedor.filter(producto => producto.cantidad !== 0);

    productosNoCero.forEach((producto, index) => {
      doc.text(`${producto.nombre} - ${producto.cantidad}`, 10, 70 + index * 10);
    });

    // Guardar o visualizar el PDF
    doc.save('orden_compra.pdf');
  }

  generarListadoProductos(proveedor: Proveedor): string[] {
    const listadoProductos: string[] = [];
    proveedor.productosProveedor.forEach((productoProveedor: { cantidad: number; nombre: any; }) => {
      if (productoProveedor.cantidad > 0) {
        const item = `${productoProveedor.nombre} - ${productoProveedor.cantidad}`;
        listadoProductos.push(item);
      }
    });
    return listadoProductos;
  }
  
}
