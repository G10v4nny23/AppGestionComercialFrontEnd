import { Component, OnInit } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Cliente } from 'src/app/Interfaces/cliente';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  listaClientes: Cliente[] = [];
  columnasTabla: string[] =['nombre', 'apellido', 'correo', 'telefono']

  clienteRegistro: Cliente ={
    idCliente: 0,
    nombre: '',
    apellido: '',
    correo: '',
    telefono: ''
  };
  nextId: number = 1;

  constructor() { }

  guardarCliente(){
    this.clienteRegistro.idCliente = this.nextId;
    this.nextId++;

    let clientes:Cliente[] = [];
    const clientesGuardados = localStorage.getItem('clientes');
    if(clientesGuardados){
      clientes = JSON.parse(clientesGuardados)
    }
    clientes.push(this.clienteRegistro)
    localStorage.setItem('clientes', JSON.stringify(clientes))

    //reiniciamos el formulario
    this.clienteRegistro = {
      idCliente: 0,
      nombre: '',
      apellido: '',
      correo: '',
      telefono: ''
    };
    alert("Cliente guardado correctamente.")
    
  }

  mostrarClientes() {
    const clientesGuardados = localStorage.getItem('clientes');
    if (clientesGuardados) {
      this.listaClientes = JSON.parse(clientesGuardados);
    }
  }



  ngOnInit() {
    this.mostrarClientes()
  }

}
