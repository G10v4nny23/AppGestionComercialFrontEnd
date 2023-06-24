import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransbankConfirm } from 'src/app/Interfaces/transbank-confirm';
import { TransbankService } from 'src/app/Services/transbank.service';
import { VistaFiados } from 'src/app/Interfaces/vista-fiados';
import { ClienteWeb } from 'src/app/Interfaces/clienteWeb';
@Component({
  selector: 'app-confirmacion-transbank',
  templateUrl: './confirmacion-transbank.component.html',
  styleUrls: ['./confirmacion-transbank.component.css'],
})
export class ConfirmacionTransbankComponent implements OnInit {
  transbankConfirm: TransbankConfirm = {
    estado: '',
    fechaTransaccion: '',
    monto: 0,
  };

  constructor(
    private ARouter: ActivatedRoute,
    private transbankService: TransbankService
  ) {}

  ngOnInit(): void {
    const token = this.ARouter.snapshot.queryParams['token_ws'];
    this.transbankService.confirmarTransaccion(token).subscribe((response) => {
      this.transbankConfirm = response;
      console.log(response);
      if(response.estado = 'AUTHORIZED'){
        this.transbankConfirm.estado = "autorizada"
        this.transbankConfirm.monto = response.monto
        this.transbankConfirm.fechaTransaccion = response.fechaTransaccion
      }else{
        this.transbankConfirm.estado = "rechazada"
      }

    });
  }


}
