import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import { SharedModule } from 'src/app/Reutilizable/shared/shared.module';
import { ModalUsuarioComponent } from './Modales/modal-usuario/modal-usuario.component';
import { ModalProductoComponent } from './Modales/modal-producto/modal-producto.component';
import { ModalDetalleVentaComponent } from './Modales/modal-detalle-venta/modal-detalle-venta.component';
import { ProveedoresComponent } from './Pages/proveedores/proveedores.component';
import { ListaFiadoComponent } from './Pages/lista-fiado/lista-fiado.component';
import { ClientesComponent } from './Pages/clientes/clientes.component';
import { ClientePruebaWebComponent } from './Pages/clientePruebaWeb/clientePruebaWeb.component';
import { ModalClienteWebComponent } from './Modales/modal-clienteWeb/modal-clienteWeb.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashBoardComponent,
    UsuarioComponent,
    ProductoComponent,
    VentaComponent,
    HistorialVentaComponent,
    ReporteComponent,
    ModalUsuarioComponent,
    ModalProductoComponent,
    ModalDetalleVentaComponent,
    ModalClienteWebComponent,
    ClientePruebaWebComponent,
    ProveedoresComponent,
    ListaFiadoComponent,
    ClientesComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule, ReactiveFormsModule
  ]
})
export class LayoutModule { }
