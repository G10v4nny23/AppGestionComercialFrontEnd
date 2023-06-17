import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'src/app/Interfaces/categoria';
import { DetalleOrdenCompra } from 'src/app/Interfaces/detalle-orden-compra';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';
import { Producto } from 'src/app/Interfaces/producto';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { CategoriaService } from 'src/app/Services/categoria.service';
import { OrdenCompraService } from 'src/app/Services/orden-compra.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { ProveedorService } from 'src/app/Services/proveedor.service';

@Component({
  selector: 'app-productoporproveedor',
  templateUrl: './productoporproveedor.component.html',
  styleUrls: ['./productoporproveedor.component.css']
})
export class ProductoporproveedorComponent implements OnInit {
  listaCategorias: Categoria[] = [];
  nuevoProducto: Producto = {
    idProducto: 0,
    nombreProducto: '',
    idCategoria: 0,
    descripcionCategoria: '',
    stock: 0,
    precio: '',
    esActivoProducto: 0
  };
  mostrarFormulario = false;
  proveedores: any[] = [];
  columnas: string[] = ['nombreProveedor', 'rutProveedor', 'acciones'];
  ordenCompraForm: FormGroup;

  constructor(
    private proveedorService: ProveedorService,
    private utilidad: UtilidadService,
    private _categoriaServicio: CategoriaService,
    private fb: FormBuilder,
    private oc: OrdenCompraService,
    private productoServicio: ProductoService
  ) {
    this.ordenCompraForm = this.fb.group({
      nombreProducto: ['', Validators.required],
      idCategoria: ['', Validators.required],
      stock: ['', Validators.required],
      precio: ['', Validators.required],
      esActivoProducto: ['1', Validators.required]
    });

    this._categoriaServicio.lista().subscribe({
      next: (data) => {
        if (data.status) this.listaCategorias = data.value;
      },
      error: (e) => {}
    });
  }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.proveedorService.lista().subscribe(
      (response) => {
        if (response.status) {
          this.proveedores = response.value;
          console.log(this.proveedores);
        } else {
          console.log("No hay proveedores o hay un error");
          this.utilidad.mostrarAlerta(
            "Error al obtener la lista de Proveedores",
            ":("
          );
        }
      },
      (error) => {
        console.log("Error en la petición", error);
      }
    );
  }

  
  generarOrdenCompra(proveedor: any) {
    console.log("Generar orden de compra para ", proveedor);
    const rutProveedor = proveedor.rutProveedor.toString(); // Obtener el valor de rutProveedor
  
    localStorage.setItem('rutProveedor', rutProveedor);
    this.mostrarFormulario = true;
    const body = { rutProveedor }; // Crear el objeto de cuerpo con el valor rutProveedor
  
    this.oc.agregarOrdenCompra(body).subscribe({
      next: (data) => {
        if (data.status) {
          this.utilidad.mostrarAlerta(
            "Orden de compra generada con éxito",
            "Ok!"
          );
        } else {
          this.utilidad.mostrarAlerta(
            "No se pudo generar la orden de compra",
            ":("
          );
        }
      },
      error: (e) => {
        this.utilidad.mostrarAlerta(
          "No se pudo generar la orden de compra",
          ":("
        );
      }
    });
  }
  

  recepcionOrdenCompra(proveedor: any) {
    console.log("Recepcionar orden de compra para ", proveedor);
  }

  agregarProducto() {
    if (
      this.nuevoProducto.nombreProducto &&
      this.nuevoProducto.esActivoProducto
    ) {
      console.log("Producto a agregar: ", this.nuevoProducto);

      const nuevoProductoProveedor: Producto = {
        idProducto: this.nuevoProducto.idProducto,
        nombreProducto: this.ordenCompraForm.value.nombreProducto.toString(),
        idCategoria: this.ordenCompraForm.value.idCategoria,
        descripcionCategoria: '',
        stock: this.ordenCompraForm.value.stock,
        precio: this.ordenCompraForm.value.precio.toString(),
        esActivoProducto: parseInt(
          this.ordenCompraForm.value.esActivoProducto
        )
      };

      this.productoServicio.guardar(nuevoProductoProveedor).subscribe({
        next: (data) => {
          if (data.status) {
            this.utilidad.mostrarAlerta(
              "Producto registrado con éxito",
              "Ok!"
            );
            this.ordenCompraForm.reset();

            // Guardar en detalleOrdenCompra
            const detalle: DetalleOrdenCompra = {
              idOrdenCompra: 0, // Asignar el ID de la orden de compra correspondiente
              idProducto: data.value.idProducto, // Obtener el ID del producto guardado
              cantidad: nuevoProductoProveedor.stock,
              precio: parseFloat(nuevoProductoProveedor.precio)
            };

            this.oc.detalleOrdenCompra(detalle).subscribe({
              next: (detalleData) => {
                if (detalleData.status) {
                  this.utilidad.mostrarAlerta(
                    "Producto agregado a la orden de compra",
                    "Ok!"
                  );
                } else {
                  this.utilidad.mostrarAlerta(
                    "No se pudo agregar el producto a la orden de compra",
                    ":("
                  );
                }
              },
              error: (e) => {
                this.utilidad.mostrarAlerta(
                  "No se pudo agregar el producto a la orden de compra",
                  ":("
                );
              }
            });
          } else {
            this.utilidad.mostrarAlerta(
              "Producto no se pudo guardar",
              ":("
            );
          }
        },
        error: (e) => {
          this.utilidad.mostrarAlerta("Error al guardar el producto", ":(");
        }
      });
    } else {
      this.utilidad.mostrarAlerta(
        "Completa todos los campos, por favor",
        "Ok!"
      );
    }
  }
}
