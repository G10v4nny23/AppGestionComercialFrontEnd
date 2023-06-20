import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import { ProveedoresComponent } from './Pages/proveedores/proveedores.component';
import { ListaFiadoComponent } from './Pages/lista-fiado/lista-fiado.component';
import { ClientesComponent } from './Pages/clientes/clientes.component';
import { ClientePruebaWebComponent } from './Pages/clientePruebaWeb/clientePruebaWeb.component';
import { PruebaWSPComponent } from './Pages/prueba-wsp/prueba-wsp.component';
import { OrdenesDeCompraComponent } from './Pages/ordenes-de-compra/ordenes-de-compra.component';




const routes: Routes = [{
  path:'',
  component:LayoutComponent,
  children:[
    {path:'dashboard',component:DashBoardComponent},
    {path:'usuarios',component:UsuarioComponent},
    {path:'productos',component:ProductoComponent},
    {path:'venta',component:VentaComponent},
    {path:'historial_venta',component:HistorialVentaComponent},
    {path:'reportes',component:ReporteComponent},
    {path:'listaProveedores', component:ProveedoresComponent},
    {path:'listaFiado', component:ListaFiadoComponent},
    {path:'clientes', component:ClientePruebaWebComponent},
    {path: 'pruebaWSP', component:PruebaWSPComponent},
    {path:'ordenesCompra', component:OrdenesDeCompraComponent}


   ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
