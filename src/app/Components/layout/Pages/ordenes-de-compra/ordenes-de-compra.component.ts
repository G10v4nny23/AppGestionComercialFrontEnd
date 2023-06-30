import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from 'src/app/Interfaces/producto';
import { ProductoService } from 'src/app/Services/producto.service';
import { map } from 'rxjs/operators';
import { ResponseApi } from 'src/app/Interfaces/response-api';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


interface ProductoSeleccionado {
  producto: Producto;
  cantidad: number;
  precioCompra:number
  total?:number

}

@Component({
  selector: 'app-ordenes-de-compra',
  templateUrl: './ordenes-de-compra.component.html',
  styleUrls: ['./ordenes-de-compra.component.css']
})
export class OrdenesDeCompraComponent {

  detalleOrden: any = {};
  rutProveedor: string = '';
  mostrarSegundaParte = false;
  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  cantidadSeleccionada: number = 0;
  productosSeleccionados: ProductoSeleccionado[] = [];
  productosDetalle: string[] = [];
  idOrden: number = 0;

  ordenesProveedor: any[] = []

  constructor(
    private http: HttpClient,
    private ps: ProductoService,
    private utilidad: UtilidadService
  ) {
    this.cargarProductos();
  }

  cargarProductos() {
    this.ps.lista().pipe(
      map((response: ResponseApi) => response.value as Producto[])
    ).subscribe(
      response => {
        this.productos = response;
        console.log(this.productos);
      },
      error => {
        console.error(error);
      }
    );
  }

  agregarProducto() {
    if (this.productoSeleccionado) {
      const productoSeleccionado: ProductoSeleccionado = {
        producto: this.productoSeleccionado,
        cantidad: this.cantidadSeleccionada,
        precioCompra: this.productoSeleccionado.precioCompra
      };
      this.productosSeleccionados.push(productoSeleccionado);
      this.productoSeleccionado = null;
      this.cantidadSeleccionada = 0;
    }
  }

  enviarOrdenCompra() {
    const endpoint = 'http://localhost:8080/ordenes-compra';
    const body = {
      rutProveedor: this.rutProveedor,
      productos: this.productosSeleccionados.map(ps => ({
        id_producto: ps.producto.idProducto,
        cantidad: ps.cantidad
      }))
    };

    console.log(this.rutProveedor);

    this.http.post<any>(endpoint, body).subscribe(
      response => {
        const orderId = response.orderId;

        console.log(response.message);

        this.utilidad.mostrarAlerta(`Orden de Compra ingresada con orden: ${orderId}`, "Ok!");
        this.cargarDetalleOrden();
      },
      error => {
        console.error(error);
      }
    );
  }

  productosSeleccionadosValidos(): boolean {
    return this.productosSeleccionados.length > 0;
  }


  agregarDetalleOrdenCompra() {
    const idOrdenCompra = this.idOrden;

    for (const producto of this.productosSeleccionados) {
      const idProducto = producto.producto.idProducto;
      const cantidad = producto.cantidad;

      const endpoint = `http://localhost:8080/orden-compra/${idOrdenCompra}/detalle`;
      const body = { ID_ORDEN_COMPRA: idOrdenCompra, ID_PRODUCTO: idProducto, CANTIDAD: cantidad };

      this.http.post(endpoint, body).subscribe(
        () => {
          this.utilidad.mostrarAlerta(`Detalle de la Orden de Compra ${idOrdenCompra} ingresada correctamente`, "Ok!");
          console.log("Detalle de la orden de compra agregado correctamente");
        },
        error => {
          console.error(error);
        }
      );
    }

    // this.cargarDetalleOrden(idOrdenCompra);
    this.generarPDF();
  }


  cargarDetalleOrden() {
  // cargarDetalleOrden(idOrden: number) {
    const endpoint = `http://localhost:8080/proveedores/${this.rutProveedor}/ordenes-compra`;
    // const endpoint = `http://localhost:8080/orden-compra/${idOrden}/detalle`;

    this.http.get(endpoint).subscribe(
      (response: any) => {
        // this.detalleOrden = response;
        this.ordenesProveedor = response;
        console.log(response)
      },
      error => {
        console.error(error);
      }
    );
  }

  generarPDF() {
    const idOrdenCompra = this.idOrden;
  
    if (!idOrdenCompra) {
      console.error("La ID de la orden de compra es obligatoria.");
      return;
    }
  
    const endpoint = `http://localhost:8080/orden-compra/${idOrdenCompra}/detalle`;
  
    this.http.get<Object>(endpoint).subscribe(
      (response: Object) => {
        const detalleOrden = response as any[];
  
        if (!detalleOrden || detalleOrden.length === 0) {
          console.error("No se encontraron datos válidos en la respuesta del servidor.");
          return;
        }
  
        // anotamos variables para hacer el cálculo del IVA
        let totalGeneral = 0;
        const doc = new jsPDF('portrait','pt', 'legal');
  
        // Contenido del PDF //

        // Encabezados de la tabla
        const headers = ['ID Producto', 'Nombre Producto', 'Cantidad', 'Precio', 'Total'];
  
        const data = this.productosSeleccionados.map((productoSeleccionado) => {
          const { producto, cantidad, precioCompra } = productoSeleccionado;
          const total = cantidad * precioCompra;
          totalGeneral += total; // Sumar al total general
  
          return [producto.idProducto, producto.nombreProducto, cantidad, precioCompra, total];
        });

        const iva = 0.19;
        const totalIVA = totalGeneral *(1+iva);
        console.log(totalIVA)  

        // Generar la tabla
        autoTable(doc, {
          head: [headers],
          body: data,
          startY: 50
        });
        const textOptionsLight = "center"
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text("Gestion Comercial LTDA", 20, 20, null);
        doc.text(`Orden de Compra número: ${idOrdenCompra}`, 20, 35, null)
        doc.text(`Neto Orden de Compra $${totalGeneral}`, 375, 120, null)
        doc.text(`Total Orden de Compra $${totalIVA}`, 375, 135, null)
        
        // Mostrar el PDF en una nueva pestaña del navegador
        doc.output('dataurlnewwindow');
      },
      error => {
        console.error("Error al obtener los datos del servidor:", error);
      }
    );
  }


  


}
